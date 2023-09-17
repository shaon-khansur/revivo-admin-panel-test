import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
    User,
    getAuth,
    updatePassword,
    updateProfile,
} from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private fuseConfimation: FuseConfirmationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            // twoStep          : [true],
            // askPasswordChange: [false],
        });
    }

    submit(): void {
        if (this.securityForm.valid) {
            updatePassword(
                this.userService.firebaseUser,
                this.securityForm.value.newPassword
            ).then((res) => {
                this.fuseConfimation.open({
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
                this.securityForm.reset();
                this.securityForm.updateValueAndValidity();
            });
        }
    }
}
