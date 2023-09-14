import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    I18nPluralPipe,
    NgClass,
    NgFor,
    NgIf,
} from '@angular/common';
import { UsersService } from '../users.service';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        AsyncPipe,
        I18nPluralPipe,
        NgClass,
        NgIf,
        NgFor,
    ],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
    usersService = inject(UsersService);
    usersCount: number = 0;
    usersList$: Observable<User[]>;
    selectedUser: User;
    drawerMode: 'side' | 'over';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _fuseMediaWatcherService: FuseMediaWatcherService

    ) {}

    ngOnInit(): void {
        this.usersList$ = this.usersService.users$;
        this.usersService.users$.subscribe((list) => {
            console.log('user list', list);
            this.usersCount = list.length;
            this._changeDetectorRef.markForCheck();
        });

        this.usersService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                // Update the selected contact
                this.selectedUser = user;
                console.log('selected user', this.selectedUser)
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                this.selectedUser = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    createUser(): void {
        // Create the contact
        this.usersService.createUser({}).subscribe((newUser) => {
            // Go to the new contact
            this._router.navigate(['./', newUser.id], {
                relativeTo: this._activatedRoute,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
