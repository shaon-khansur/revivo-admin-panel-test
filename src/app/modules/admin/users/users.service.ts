import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import {
    BehaviorSubject,
    Observable,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    constructor(private http: HttpClient) {}

    getAllUser(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.baseUrl}users`).pipe(
            tap((users) => {

                this._users.next(users);
            })
        );
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }
    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    getUserById(id: string): Observable<User> {
        return this._users.pipe(
            take(1),
            map((users) => {
                // Find the contact
                const user = users.find((item) => item.id === id) || null;

                // Update the contact
                this._user.next(user);

                // Return the contact
                return user;
            }),
            switchMap((user) => {
                if (!user) {
                    return throwError(
                        'Could not found contact with id of ' + id + '!'
                    );
                }

                return of(user);
            })
        );
    }

    createUser(data): Observable<any> {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('role', data.role);
        return this.http.post(`${environment.baseUrl}sign-up`, formData);
    }

    updateUser(id, data): Observable<any> {
        return this.http.put(`${environment.baseUrl}users/${id}`, data);
    }

    deleteUser(id): Observable<any> {
        return this.http.delete(`${environment.baseUrl}users/${id}`);
    }
}
