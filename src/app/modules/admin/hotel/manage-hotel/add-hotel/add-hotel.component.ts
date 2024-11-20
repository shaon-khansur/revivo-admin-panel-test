import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-add-hotel',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
    ],
    templateUrl: './add-hotel.component.html',
    styleUrls: ['./add-hotel.component.scss'],
})
export class AddHotelComponent implements OnInit {
    hotelForm!: FormGroup;
    currentTabIndex = 0;
    ratings: number[] = [1, 2, 3, 4, 5];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.hotelForm = this.fb.group({
            HotelName: ['', Validators.required],
            HotelRate: ['', Validators.required],
            isKosher: [false],
            city: ['', Validators.required],
            countryName: ['', Validators.required],
            HotelFacilities: this.fb.array([]),
            HotelImages: this.fb.array([]),
            HotelRemarks: this.fb.array([]),
            HotelLocation: this.fb.group({
                latitude: ['', Validators.required],
                longitude: ['', Validators.required],
                CityCode: ['', Validators.required],
                CityName: ['', Validators.required],
                CountryCode: [''],
                CountryName: [''],
                Description: [``, Validators.required],
                Address: this.fb.group({
                    street: ['', Validators.required],
                    house_number: [''],
                    zipcode: [''],
                    phone: ['', Validators.required],
                    fax: [''],
                    email: ['', [Validators.required, Validators.email]],
                }),
            }),
            Website: [''],
            HotelID: [''],
        });
    }

    get facilities(): FormArray {
        return this.hotelForm.get('HotelFacilities') as FormArray;
    }

    get images(): FormArray {
        return this.hotelForm.get('HotelImages') as FormArray;
    }

    get remarks(): FormArray {
        return this.hotelForm.get('HotelRemarks') as FormArray;
    }

    addFacility(): void {
        this.facilities.push(
            this.fb.group({
                FacilityTitle: ['', Validators.required],
                Url: [''],
            })
        );
    }

    removeFacility(index: number): void {
        this.facilities.removeAt(index);
    }

    addImage(): void {
        this.images.push(
            this.fb.group({
                ImageTitle: ['', Validators.required],
                Url: ['', Validators.required],
            })
        );
    }

    removeImage(index: number): void {
        this.images.removeAt(index);
    }

    addRemark(): void {
        this.remarks.push(
            this.fb.group({
                RemarkType: ['', Validators.required],
                FreeText: ['', Validators.required],
            })
        );
    }

    removeRemark(index: number): void {
        this.remarks.removeAt(index);
    }

    goToNextTab(): void {
        if (this.currentTabIndex < 2) {
            this.currentTabIndex++;
        }
    }

    submitForm(): void {
        if (this.hotelForm.valid) {
            console.log('Form Submitted:', this.hotelForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}
