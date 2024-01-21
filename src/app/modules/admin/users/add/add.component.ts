import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-add',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
    ],
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
    userCreateForm: FormGroup;
    userRole: any[] = [
        { name: 'Admin', value: 'admin' },
        { name: 'Support & Billing', value: 'support_and_billing' },
    ];
    constructor(
        private fb: FormBuilder,
        private usersService: UsersService,
        private _dialogRef: MatDialogRef<AddComponent>
    ) {}

    ngOnInit(): void {
        this.userCreateForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            role: ['', Validators.required],
        });
    }

    createUser(): void {
        this.userCreateForm.markAllAsTouched();
        if (this.userCreateForm.valid) {
            this.usersService.singUpUser(this.userCreateForm.value).subscribe(user => {
                console.log('user', user)
                this._dialogRef.close(user);
            })
            // this.usersService.createUser(this.userCreateForm.value).subscribe({
            //     next: (res) => {
            //         console.log(console.log(res));
            //         this._dialogRef.close(res.data);
            //     },
            // });
        }
    }

    uploadAvatar(files) {
        console.log(files);
    }

    removeAvatar(): void {}
}
