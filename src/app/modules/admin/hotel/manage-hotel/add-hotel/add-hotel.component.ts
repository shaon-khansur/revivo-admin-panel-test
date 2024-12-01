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
import { EditHotelImageComponent } from '../hotel-details/edit-hotel-image/edit-hotel-image.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EditFacilityComponent } from '../hotel-details/edit-facility/edit-facility.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardComponent } from '@fuse/components/card';
import { GalleryComponent } from './gallery/gallery.component';
import { HotelService } from '../../hotel.service';

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
        MatExpansionModule,
        MatDialogModule,
        MatIconModule,
        MatDividerModule,
        MatMenuModule,
        MatTooltipModule,
        FuseCardComponent,
        GalleryComponent,
    ],
    templateUrl: './add-hotel.component.html',
    styleUrls: ['./add-hotel.component.scss'],
})
export class AddHotelComponent implements OnInit {
    hotelForm!: FormGroup;
    currentTabIndex = 0;
    currentTab: string = 'description'; // Default selected tab
    defaultImages = [
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
        {
            Url: 'assets/images/blank_image.jpg',
            ImageType: 'HOTEL',
        },
    ];
    price: number = 0;
    currency: string = '';
    roomCategories: any[] = [];

    constructor(private fb: FormBuilder, private dialog: MatDialog, private hotelService: HotelService) {}

    ngOnInit(): void {
        this.hotelForm = this.fb.group({
            HotelName: ['', Validators.required],
            HotelRate: ['', Validators.required],
            isKosher: [false],
            cityHeb: [''],
            countryName: [''],
            HotelFacilities: this.fb.array([]),
            HotelImages: this.fb.array([]),
            HotelRemarks: this.fb.array([]),
            HotelLocation: this.fb.group({
                latitude: [''],
                longitude: [''],
                CityCode: ['', Validators.required],
                CityName: ['', Validators.required],
                CountryCode: [''],
                CountryName: [''],
                Description: [``],
                Address: this.fb.group({
                    street: [''],
                    house_number: [''],
                    zipcode: [''],
                    phone: [''],
                    fax: [''],
                    email: [''],
                }),
            }),
            Website: [''],
            HotelID: [''],
            source: ['admin'],

            // roomsDescription: this.fb.group({
            //     package_type: [''],
            //     remarks: [''],
            //     selected_category: [''],
            //     complects: {},
            //     infantPrice: this.fb.group({
            //         currency: [this.currency],
            //         amount: [this.price],
            //     }),
            //     additionalPayments: this.fb.array([]),
            //     dealData: [],
            //     restrictions: [''],
            //     supplements: [''],
            //     taxes: [''],
            // }),
        });
    }

    switchTab(tabName: string): void {
        this.currentTab = tabName;
    }

    // -------------------------------------------  image ---------------------------------------
    get images(): FormArray {
        return this.hotelForm.get('HotelImages') as FormArray;
    }
    get previewImages() {
        return this.images.controls.filter(
            (image: any) => image.get('ImageType').value === 'PREVIEW'
        );
    }

    openEditHotelImage(index: number): void {
        const imageControl = this.images.at(index);

        const dialogRef = this.dialog.open(EditHotelImageComponent, {
            width: '400px',
            data: {
                ImageTitle: imageControl.get('ImageTitle').value,
                Url: imageControl.get('Url').value,
                ImageType: imageControl.get('ImageType').value,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save' && result?.data) {
                this.images.at(index).patchValue(result.data);
            } else if (result?.action === 'delete') {
                this.removeImage(index);
            }
        });
    }

    addImage(): void {
        const dialogRef = this.dialog.open(EditHotelImageComponent, {
            width: '400px',
            data: {
                ImageTitle: '',
                Url: '',
                ImageType: '',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save' && result?.data) {
                this.images.push(this.fb.group(result.data));
                console.log('images', this.images);
            }
        });
    }

    removeImage(index: number): void {
        if (this.images.length >= 0) {
            this.images.removeAt(index);
        }
    }

    // -------------------------------------------  facility ---------------------------------------
    get facilities(): FormArray {
        return this.hotelForm.get('HotelFacilities') as FormArray;
    }
    openEditFacility(index: number): void {
        const facilityControl = this.facilities.at(index);

        const dialogRef = this.dialog.open(EditFacilityComponent, {
            width: '400px',
            data: {
                FacilityTitle: facilityControl.get('FacilityTitle').value,
                FacilityCode: facilityControl.get('FacilityCode').value,
                FacilityType: facilityControl.get('FacilityType').value,
                Url: facilityControl.get('Url').value,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save' && result?.data) {
                this.facilities.at(index).patchValue(result.data);
            } else if (result?.action === 'delete') {
                this.removeFacility(index);
            }
        });
    }

    addFacility(): void {
        const dialogRef = this.dialog.open(EditFacilityComponent, {
            width: '400px',
            data: {
                FacilityTitle: '',
                FacilityCode: '',
                FacilityType: '',
                Url: '',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save' && result?.data) {
                this.facilities.push(this.fb.group(result.data));
            }
        });
    }

    removeFacility(index: number): void {
        if (this.facilities.length >= 0) {
            this.facilities.removeAt(index);
        }
    }

    // -------------------------------------------  Remark ---------------------------------------

    get remarks(): FormArray {
        return this.hotelForm.get('HotelRemarks') as FormArray;
    }

    private createHotelRemarkGroup(): FormGroup {
        return this.fb.group({
            FreeText: [''],
            RemarkType: [''],
        });
    }

    addRemark(): void {
        this.remarks.push(this.createHotelRemarkGroup());
    }

    removeRemark(index: number): void {
        if (this.remarks.length >= 0) {
            this.remarks.removeAt(index);
        }
    }

    goToNextTab(): void {
        if (this.currentTabIndex < 2) {
            this.currentTabIndex++;
        }
    }

    // Method to update the price when the input changes
    updatePrice(newPrice: number): void {
        this.price = newPrice;
        this.hotelForm
            .get('roomsDescription')
            .get('infantPrice.amount')
            .setValue(this.price);
    }

    // Method to update the currency when the input changes
    updateCurrency(newCurrency: string): void {
        this.currency = newCurrency;
        this.hotelForm
            .get('roomsDescription')
            .get('infantPrice.currency')
            .setValue(this.currency);
    }

    // Method to add a new additional payment entry
    addAdditionalPayment(): void {
        const additionalPaymentsArray = this.hotelForm
            .get('roomsDescription')
            .get('additionalPayments') as FormArray;
        additionalPaymentsArray.push(
            this.createAdditionalPayment('', '', '', '')
        );
    }

    // Method to create an additional payment FormGroup
    createAdditionalPayment(
        restriction: string,
        value: string,
        rule: string,
        summ: string
    ): FormGroup {
        return this.fb.group({
            restriction: [restriction, Validators.required],
            value: [value, Validators.required],
            rule: [rule, Validators.required],
            summ: [summ, Validators.required],
        });
    }
    // Method to remove an additional payment entry
    removeAdditionalPayment(index: number): void {
        const additionalPaymentsArray = this.hotelForm
            .get('roomsDescription')
            .get('additionalPayments') as FormArray;
        additionalPaymentsArray.removeAt(index);
    }

    submitForm(): void {
        if (this.hotelForm.valid) {
            const formValue = this.hotelForm.value; 

            // const infantPrice = {
            //     [formValue?.roomsDescription?.infantPrice.currency]:
            //         formValue?.roomsDescription?.infantPrice?.amount,
            // };

            // // Prepare the final data for submission
            // const finalData = {
            //     ...formValue,
            //     roomsDescription: {
            //         ...formValue?.roomsDescription, 
            //         infantPrice: infantPrice, 
            //     },
            // };

            console.log('Form Submitted:', formValue);

            this.hotelService.addHotel(formValue).subscribe((response)=>{
                console.log("response data", response);
                
            })
        } else {
            const formValue = this.hotelForm.value; 
            console.log('form control', this.hotelForm);

            console.log(formValue);

            // const infantPrice = {
            //     [formValue?.roomsDescription?.infantPrice.currency]:
            //         formValue?.roomsDescription?.infantPrice?.amount,
            // };

            // // Prepare the final data for submission
            // const finalData = {
            //     ...formValue,
            //     roomsDescription: {
            //         ...formValue?.roomsDescription, 
            //         infantPrice: infantPrice,
            //     },
            // };

            console.log('Form is invalid', formValue);
        }
    }
}
