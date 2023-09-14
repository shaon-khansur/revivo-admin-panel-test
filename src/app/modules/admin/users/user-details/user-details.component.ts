import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { UserListComponent } from '../user-list/user-list.component';
import { User } from 'app/core/user/user.types';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UsersService } from '../users.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { getAuth, Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-user-details',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        TextFieldModule,
        MatRippleModule,
        MatOptionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        RouterLink,
        FuseFindByKeyPipe,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgFor,
        NgClass,
        NgIf,
    ],
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
    user: User;
    users: User[];
    userRole: any[] = [
        { name: 'Admin', value: 'admin' },
        { name: 'Support & Billing', value: 'support_and_billing' },
    ];
    editMode: boolean = false;
    userForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    constructor(
        private _userListComponent: UserListComponent,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _usersService: UsersService,
        private fauth: Auth
    ) {}
    ngOnInit(): void {
        console.log('Deatails component rendered');

        // Open the drawer
        this._userListComponent.matDrawer.open();

        // Create the contact form
        this.userForm = this._formBuilder.group({
            id: [''],
            avatar: [''],
            name: ['', [Validators.required]],
            email: ['', [Validators.required]],
            role: this._formBuilder.group({
                role: [''],
            }),
        });

        this._usersService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: User[]) => {
                this.users = users;
                console.log('D', this.users);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._usersService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                // Open the drawer in case it is closed
                this._userListComponent.matDrawer.open();

                // Get the contact
                this.user = user;

                // Clear the emails and phoneNumbers form arrays
                // (this.contactForm.get('emails') as UntypedFormArray).clear();
                // (
                //     this.contactForm.get('phoneNumbers') as UntypedFormArray
                // ).clear();

                // Patch values to the form
                this.userForm.patchValue(user);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._userListComponent.matDrawer.close();
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        console.log('file', file);

        // Upload the avatar
        // this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    }

    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.userForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.user.avatar = null;
    }

    deleteUser(): void {
        // Open the confirmation dialog
        console.log('delete user called');
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    updateUser(): void {
        console.log('Update user called', this.userForm.value);
        this._usersService
            .updateUser(this.userForm.value.id, this.userForm.value)
            .subscribe({
                next: (res) => {
                    this._fuseConfirmationService.open({
                        title: 'User updated.',
                        message: 'Successfuly updated user',

                        icon: {
                            show: true,
                            name: 'heroicons_outline:check',
                            color: 'accent',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Ok',
                                color: 'primary',
                            },
                        },
                        dismissible: false,
                    });
                },
                error: (err) => {
                    this._fuseConfirmationService.open({
                        title: 'User updated.',
                        message: 'Successfuly updated user',

                        icon: {
                            show: true,
                            name: 'heroicons_outline:check',
                            color: 'warn',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Ok',
                                color: 'primary',
                            },
                        },
                        dismissible: false,
                    });
                }
            });
        // Get the contact object
        // const contact = this.contactForm.getRawValue();

        // // Go through the contact object and clear empty values
        // contact.emails = contact.emails.filter((email) => email.email);

        // contact.phoneNumbers = contact.phoneNumbers.filter(
        //     (phoneNumber) => phoneNumber.phoneNumber
        // );

        // // Update the contact on the server
        // this._contactsService
        //     .updateContact(contact.id, contact)
        //     .subscribe(() => {
        //         // Toggle the edit mode off
        //         this.toggleEditMode(false);
        //     });
    }
}
