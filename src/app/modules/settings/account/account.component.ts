import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    onAuthStateChanged,
    getAuth,
    User,
    updateProfile,
} from '@angular/fire/auth';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private fuseConfirm: FuseConfirmationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.accountForm = this._formBuilder.group({
            name: ['', Validators.required],
        });

        this.accountForm.patchValue({
            name: this.userService.firebaseUser.displayName,
        });
    }

    update(): void {
        updateProfile(this.userService.firebaseUser, {
            displayName: this.accountForm.value.name,
        }).then((res) => {
            this.fuseConfirm.open({
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
        });
    }
}
