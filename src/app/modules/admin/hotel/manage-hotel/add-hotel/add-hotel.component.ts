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
import { RoomDescriptionsComponent } from './room-descriptions/room-descriptions.component';

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
        RoomDescriptionsComponent,
    ],
    templateUrl: './add-hotel.component.html',
    styleUrls: ['./add-hotel.component.scss'],
})
export class AddHotelComponent implements OnInit {
    hotelForm!: FormGroup;
    currentTabIndex = 0;
    currentTab: string = 'room'; // Default selected tab
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

    constructor(private fb: FormBuilder, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.hotelForm = this.fb.group({
            HotelName: ['', Validators.required],
            HotelRate: ['', Validators.required],
            isKosher: [false],
            cityHeb: ['', Validators.required],
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
            source: ['admin'],
            
            roomsDescription: this.fb.group({
                package_type: ['', Validators.required],
                remarks: ['', Validators.required],
                selected_category: ['', Validators.required],
                complects: this.fb.group({}),
                infantPrice: this.fb.group({}),
                additionalPayments: this.fb.array([]),
                dealData: this.fb.array([]),
                restrictions: [''],
                supplements: [''],
                taxes: ['', Validators.required],
            }),
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

    submitForm(): void {
        if (this.hotelForm.valid) {
            console.log('Form Submitted:', this.hotelForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}
