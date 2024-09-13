import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-edit-facility',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './edit-facility.component.html',
    styleUrls: ['./edit-facility.component.scss'],
})
export class EditFacilityComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditFacilityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
          FacilityTitle: [data.FacilityTitle || ''],
          FacilityCode: [data.FacilityCode || ''],
          FacilityType: [data.FacilityType || ''],
          Url: [data.Url || '']
        });
    }

    onSave(): void {
      this.dialogRef.close({ action: 'save', data: this.form.value });
  }

    onCancel(): void {
        this.dialogRef.close();
    }
    onDelete(): void {
      this.dialogRef.close({ action: 'delete' });
    }
}
