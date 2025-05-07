import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {
    _MatSlideToggleRequiredValidatorModule,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-update-facility',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterModule,
        _MatSlideToggleRequiredValidatorModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
    templateUrl: './update-facility.component.html',
    styleUrls: ['./update-facility.component.scss'],
})
export class UpdateFacilityComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UpdateFacilityComponent>,
        @Inject(MAT_DIALOG_DATA) public facility: any,
        private fb: FormBuilder
    ) {
        // Initialize the form
        this.form = this.fb.group({
            tag: [this.facility?.tag || ''],
            iconName: [
                this.facility?.iconName || '',
            ],
      
    
            id: facility.id,
        });

        // Update form with data from the dialog
        this.updateForm(facility);
    }

    // Get airport data as an array
    get airportDataArray(): FormArray {
        return this.form.get('airportData') as FormArray;
    }

    // Method to patch the form with new data
    updateForm(facility: any): void {
        this.form.patchValue({
            tag: facility.tag,
            iconName: facility.iconName,
            id: facility.id,
        });
    }

    // Method to save the form data
    onSave(): void {
        if (this.form.valid) {
            this.dialogRef.close({ action: 'save', data: this.form.value });
        }
    }

    // Method to cancel and close the dialog
    onCancel(): void {
        this.dialogRef.close();
    }
}
