import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import {
    Auth,
    UserCredential,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    setPersistence,
    browserSessionPersistence,
} from '@angular/fire/auth';
import { Route, Router } from '@angular/router';
import { IdTokenResult } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    systemUser$: Observable<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: { role: string };
    }>;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private auth: Auth,
        private router: Router
    ) {
        this.systemUser$ = new Observable((observer) => {
            onAuthStateChanged(
                this.auth,
                (user: User) => {
                    if (user) {
                        user.getIdTokenResult().then((value) => {
                            // console.log('valueof otken', value);
                            observer.next({
                                id: user.uid,
                                name: user.displayName,
                                email: user.email,
                                role: { role: value.claims['role'] },
                                avatar: user.photoURL ? user.photoURL : '',
                            });
                        });
                    } else {
                        observer.next(null);
                    }
                },
                (error) => {
                    observer.next(null);
                },
                () => {
                    console.log('completed called Bor!')
                    // observer.complete();
                }
            );
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return new Observable((observer) => {
            signInWithEmailAndPassword(
                this.auth,
                credentials.email,
                credentials.password
            )
                .then((userCrendetial: UserCredential) => {
                    userCrendetial.user.getIdToken().then((token) => {
                        this.accessToken = token;
                        this._authenticated = true;
                        this._userService.user = {
                            id: userCrendetial.user.uid,
                            name: userCrendetial.user.displayName,
                            email: userCrendetial.user.email,
                            avatar: userCrendetial.user.photoURL,
                        };
                        observer.next(userCrendetial);
                    });
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
        // return this._httpClient.post('api/auth/sign-in', credentials).pipe(
        //     switchMap((response: any) => {
        //         // Store the access token in the local storage
        //         this.accessToken = response.accessToken;

        //         // Set the authenticated flag to true
        //         this._authenticated = true;

        //         // Store the user on the user service
        //         this._userService.user = response.user;

        //         // Return a new observable with the response
        //         return of(response);
        //     })
        // );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        console.log('signInUsingToken fn');
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() => {
                    // Return false
                    console.log('signInUsingToken catch Error');
                    return of(false);
                }),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        try {
            signOut(this.auth).then(() => {});
            return of(true);
        } catch (err) {}
        // Return the observable
    }

    createUserWithFirebase(data): Observable<any> {
        return this._httpClient.post(`${environment.baseUrl}sign-up`, data);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'multipart/form-data', // Example header
                // Add more headers as needed
            }),
        };
        return this._httpClient.post('api/auth/sign-up', user, httpOptions);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return this.systemUser$.pipe(
            switchMap((user) => {
                if (user) {
                    // console.log('systemUser', user);
                    return of(true);
                } else {
                    return of(false);
                }
            })
        );

        // If the access token exists, and it didn't expire, sign in using it
        // return this.signInUsingToken();
    }
}
