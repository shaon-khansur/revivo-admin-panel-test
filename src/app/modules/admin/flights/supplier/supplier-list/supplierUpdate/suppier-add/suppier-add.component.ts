import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-suppier-add',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './suppier-add.component.html',
    styleUrls: ['./suppier-add.component.scss'],
})
export class SuppierAddComponent {
    form: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<SuppierAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            name: [data?.name || ''],
            code: [data?.code || ''],
        });
    }

    onSave(): void {
        this.dialogRef.close({ action: 'save', data: this.form.value });
    }

    onCancel(): void {
        // Close the dialog without saving when the user clicks "Cancel"
        this.dialogRef.close();
    }
}
