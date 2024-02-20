import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-airline-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './airline-dialog.component.html',
    styleUrls: ['./airline-dialog.component.scss'],
})
export class AirlineDialogComponent implements OnInit {
    form: FormGroup;
    fileString;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AirlineDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private dialogData: any
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
            code: [''],
            file: this.fb.group({
                content: [''],
                name: [''],
                type: [''],
            }),
            logo: ['']
        });

        if (this.dialogData) {
            console.log('dialogData', this.dialogData)
            this.form.patchValue(this.dialogData)
        }
    }

    get airlogo() {
        return this.form.get('logo').value;
    }

    uploadAvatar(fileList: FileList): void {
        let avatar;
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

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileString = event.target.result as string;
            this.fileString = fileString;
            console.log('flileString', fileString)
            const base64Image = fileString.split(',')[1];


            // Create the avatar object
            avatar = {
                content: base64Image,
                name: file.name,
                type: file.type,
            };
            this.form.get('file').patchValue(avatar);

            console.log('avatar inside', avatar);
            console.log('avatar inside', this.form.value);

            // Set the avatar object in the form control
            // this.form.get('avatar').setValue(avatar, { emitEvent: false }); // Don't emit the change event

            // Use setTimeout to ensure the setValue operation is completed before calling createDestination
        };

        reader.readAsDataURL(file);

        console.log('avatar', avatar);
    }

    update(): void {
        this.dialogRef.close(this.form.value)
    }

    close(): void {
        console.log(this.form.value)
        const content = this.form.value.file.content
        console.log(JSON.stringify(this.form.value))
        this.dialogRef.close(null)
    }
}
