import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-update',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
})
export class UpdateComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: [data?.name || ''],
            code: [data?.code || ''],
        });
    }

    onSave(): void {
        // Pass back the form data when the user clicks "Save"
        this.dialogRef.close({ action: 'save', data: this.form.value });
    }

    onCancel(): void {
        // Close the dialog without saving when the user clicks "Cancel"
        this.dialogRef.close();
    }
}
