import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User } from './user.types';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    firebaseUser;
    private auth = inject(Auth);
    private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    // private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        onAuthStateChanged(this.auth, (user) => {
            this.firebaseUser = user;
            if (user) {
                user.getIdTokenResult().then((value) => {
                    console.log('value', value)
                    this._user.next({
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        role: { role: value.claims['role'] },
                    });
                });
            }
            console.log('user services user patch');
        });

        // this.authService.systemUser$.subscribe(user => {
        //     this.user = user;
        // })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
