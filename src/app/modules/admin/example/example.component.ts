import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { authState, Auth } from '@angular/fire/auth';
import {  } from '@angular/fire/app';
import { Subscription } from 'rxjs';


@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent implements OnInit, OnDestroy {

    auth: any = inject(Auth);

    authState$ = authState(this.auth)
    authStateSubscription: Subscription;
    constructor() {}

    ngOnInit(): void {
        this.authStateSubscription = this.authState$.subscribe(user => {
            console.log(user)
        })
    }

    ngOnDestroy(): void {
        this.authStateSubscription.unsubscribe();
    }
}
