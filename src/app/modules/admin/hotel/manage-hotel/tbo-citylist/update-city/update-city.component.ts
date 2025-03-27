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
    selector: 'app-update-city',
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
    templateUrl: './update-city.component.html',
    styleUrls: ['./update-city.component.scss'],
})
export class UpdateCityComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UpdateCityComponent>,
        @Inject(MAT_DIALOG_DATA) public city: any,
        private fb: FormBuilder
    ) {
        // Initialize the form
        this.form = this.fb.group({
            cityHebrew: [this.city?.cityHebrew || ''],
            countryHebrew: [
                this.city?.countryHebrew || '',
                Validators.required,
            ],
            airportData: this.fb.array(
                this.city?.airportData?.map((airport: any) =>
                    this.createAirportGroup(airport)
                ) || []
            ),
            id: city.id,
        });

        // Update form with data from the dialog
        this.updateForm(city);
    }

    // Method to create an airport group
    createAirportGroup(airport: any): FormGroup {
        return this.fb.group({
            name: [airport.name || '',],
            tbo: [airport.tbo || false],
        });
    }

    // Get airport data as an array
    get airportDataArray(): FormArray {
        return this.form.get('airportData') as FormArray;
    }

    // Method to patch the form with new data
    updateForm(city: any): void {
        this.form.patchValue({
            cityHebrew: city.cityHebrew,
            countryHebrew: city.countryHebrew,
            id: city.id,
        });

        // Optionally update the airportData if needed
        if (city.airportData) {
            const airportDataFormArray = this.form.get(
                'airportData'
            ) as FormArray;
            // Clear existing array and add updated data
            airportDataFormArray.clear();
            city.airportData.forEach((airport: any) => {
                airportDataFormArray.push(this.createAirportGroup(airport));
            });
        }
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
