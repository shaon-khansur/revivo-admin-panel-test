import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { Observable } from 'rxjs';
import { onAuthStateChanged, getAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
    systemUser$: Observable<User>;
    constructor() {
        this.systemUser$ = new Observable((observer) => {
            onAuthStateChanged(
                getAuth(),
                (user) => {
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
                    console.log('completed called Bor!');
                    // observer.complete();
                }
            );
        });
    }
}
