// Import necessary Angular and Material components
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormGroup,
    FormArray,
    FormBuilder,
    ReactiveFormsModule,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-add-fare-family',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatRadioModule
    ],
    templateUrl: './add-fare-family.component.html',
    styleUrls: ['./add-fare-family.component.scss'],
})
export class AddFareFamilyComponent implements OnInit {
    fareForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddFareFamilyComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private mediaMatcher: MediaMatcher
    ) {}

    ngOnInit(): void {
        console.log(this.dialogData);

        this.fareForm = this.fb.group({
            id: [this.dialogData?.id || null],
            fareName: ['', Validators.required],
            fareAmount: [null, Validators.required],
            features: this.fb.array([], Validators.required),
        });

        if (
            this.dialogData &&
            this.dialogData.features &&
            this.dialogData.features.length > 0
        ) {
            this.dialogData.features.forEach(() => this.addFare());
        } else {
            if (this.isSmallDevice()) {
                this.addFare();
            } else {
                this.addFare();
                this.addFare();
            }
        }
        if (this.dialogData) {
            this.fareForm.patchValue(this.dialogData);
        }
    }
    get faresFormArray(): FormArray {
        return this.fareForm.get('features') as FormArray;
    }
    addFare(): void {
        this.faresFormArray.push(this.createFareFormGroup());
    }
    removeFare(index: number): void {
        this.faresFormArray.removeAt(index);
    }
    close(): void {
        this.dialogRef.close();
    }

    submitForm(): void {
        if (this.fareForm.valid) {
            if (this.faresFormArray.length === 0) {
                alert('Please add at least one feature.');
            } else {
                this.dialogRef.close(this.fareForm.value);
            }
        } else {
            console.log('Form is invalid. Please check your entries.');
        }
    }

    private isSmallDevice(): boolean {
        return this.mediaMatcher.matchMedia('(max-width: 779px)').matches;
    }

    private createFareFormGroup(): FormGroup {
        return this.fb.group({
            fareFeatureTitle: ['', Validators.required],
            fareFeatureIcon: ['', Validators.required],
            fareFeatureLabel: ['', Validators.required],
            fareFeatureLabelNon: ['', Validators.required],
            fareFeatureIncluded: [false],
        });
    }
}
