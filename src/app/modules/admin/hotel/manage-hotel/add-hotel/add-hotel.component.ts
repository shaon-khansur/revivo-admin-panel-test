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
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
        MatIconModule,
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
        },
        {
            Url: 'assets/images/blank_image.jpg',
        },
        {
            Url: 'assets/images/blank_image.jpg',
        },
        {
            Url: 'assets/images/blank_image.jpg',
        },
        {
            Url: 'assets/images/blank_image.jpg',
        },
        {
            Url: 'assets/images/blank_image.jpg',
        },
    ];
    previewImages: any;
    price: number = 0;
    currency: string = '';
    roomCategories: any[] = [];
    hotelIfo: any;
    id: string;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private hotelService: HotelService,
        private route: ActivatedRoute,
        private router: Router,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.id = params['id'];
            console.log('params', params);
            this.hotelForm = this.fb.group({
                HotelName: ['', Validators.required],
                Description: [''],
                HotelFacilities: this.fb.array([]),
                Attractions: [''],
                Address: [''],
                PinCode: [''],
                CityCode: [''],
                CountryName: [''],
                PhoneNumber: [''],
                FaxNumber: [''],
                Map: [''],
                HotelRating: [''],
                CityName: [''],
                CountryCode: [''],
                CheckInTime: [''],
                CheckOutTime: [''],
                Thumbnail: [''],
                Latitude: [''],
                Longitude: [''],
                cityLatitude: [''],
                cityLongitude: [''],
                Images: this.fb.array([]),
                HotelWebsiteUrl: [''],
                HotelCode: [''],
                source: ['admin'],
                isKosher: false,
            });
            if (this.id) {
                this.hotelService.getTBOHotelById(this.id).subscribe(
                    (hotel) => {
                        this.hotelIfo = hotel;
                        this.previewImages =
                            hotel.Images[0].Url || hotel.Thumbnail;
                        console.log('hotel data', hotel);

                        // Patch the form with hotel data
                        this.hotelForm.patchValue({
                            HotelName: hotel.HotelName,
                            Description: hotel.Description,
                            Attractions: hotel.Attractions,
                            Address: hotel.Address,
                            PinCode: hotel.PinCode,
                            CityCode: hotel.CityCode,
                            CountryName: hotel.CountryName,
                            PhoneNumber: hotel.PhoneNumber,
                            FaxNumber: hotel.FaxNumber,
                            Map: hotel.Map,
                            HotelRating: hotel.HotelRating,
                            CityName: hotel.CityName,
                            CountryCode: hotel.CountryCode,
                            CheckInTime: hotel.CheckInTime,
                            CheckOutTime: hotel.CheckOutTime,
                            Thumbnail: hotel.Thumbnail,
                            Latitude: hotel.Latitude,
                            Longitude: hotel.Longitude,
                            cityLatitude: hotel.cityLatitude,
                            cityLongitude: hotel.cityLongitude,
                            HotelWebsiteUrl: hotel.HotelWebsiteUrl,
                            HotelCode: hotel.HotelCode,
                            source: hotel.source,
                            isKosher: hotel.isKosher,
                        });
                        // Set facilities
                        this.setFacilities(hotel.HotelFacilities || []);
                        // Set hotel images
                        this.setHotelImages(hotel.Images || []);
                    },
                    (error) => {
                        console.error('Error fetching hotel:', error);
                    }
                );
            }
        });
    }

    switchTab(tabName: string): void {
        this.currentTab = tabName;
    }

    // -------------------------------------------  image ---------------------------------------
    get hotelCode(): FormArray {
        return this.hotelForm.get('HotelCode')?.value;
    }
    get images(): FormArray {
        return this.hotelForm.get('Images') as FormArray;
    }

    openEditHotelImage(index: number): void {
        const imageControl = this.images.at(index);
        const previousUrl = imageControl.get('Url').value; // Save the previous URL value
        const dialogRef = this.dialog.open(EditHotelImageComponent, {
            width: '400px',
            data: {
                Url: previousUrl, // Pass the previous URL
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog closed result:', result); // Check what is actually returned

            if (result?.action === 'save' && result?.data) {
                console.log('Data received for saving', result.data);

                const updatedData = {
                    ...result.data,
                    Url: this.id && !result.data.Url ? '' : result.data.Url,
                };
                this.images.at(index).patchValue(updatedData);
                this.previewImages = this.images[0]?.Url;
            } else if (result?.action === 'delete') {
                console.log('delete action received'); // Confirm delete is received
                this.removeImage(index);
            } else {
                console.log('No recognized action, result:', result);
            }
        });
    }

    addImage(): void {
        const dialogRef = this.dialog.open(EditHotelImageComponent, {
            width: '400px',
            data: {
                Url: '',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save' && result?.data) {
                this.images.push(this.fb.group(result.data));
                console.log('images', this.images);
                this.previewImages = this.images.value[0].Url;
            }
        });
    }

    removeImage(index: number): void {
        console.log('remove images', index);
        this.previewImages = '';
        if (this.images.length >= 0) {
            this.images.removeAt(index);
            this.previewImages = this.images.value[0].Url;
        }
    }
    private createHotelImageGroup(): FormGroup {
        return this.fb.group({
            Url: [''],
        });
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
    // private createFacilityGroup(): FormGroup {
    //     return this.fb.group({
    //         FacilityTitle: [''],
    //         FacilityCode: [''],
    //     });
    // }

    goToNextTab(): void {
        if (this.currentTabIndex < 2) {
            this.currentTabIndex++;
        }
    }

    // Set facilities in the form array based on the data retrieved
    private setFacilities(facilities: any[]): void {
        this.facilities.clear(); // Clear existing facilities
        facilities.forEach((facility) => {
            this.facilities.push(
                this.fb.group({
                    FacilityTitle: [facility.FacilityTitle || ''],
                    FacilityCode: [facility.FacilityCode || ''],
                })
            );
        });

        // Ensure at least one facility input group is present
        if (this.facilities.length === 0) {
            // this.facilities.push(this.createFacilityGroup());
        }
    }

    // Set hotel images in the form array based on the data retrieved
    setHotelImages(images: any[]): void {
        this.images.clear(); // Clear existing images

        images.forEach((image) => {
            this.images.push(
                this.fb.group({
                    Url: [image.Url || ''],
                })
            );
        });

        // Ensure at least one image input group is present
        if (this.images.length === 0) {
            this.images.push(this.createHotelImageGroup());
        }
    }

    submitForm(): void {
        if (this.hotelForm.valid) {
            const formValue = this.hotelForm.value;
            console.log('Form Submitted:', formValue);

            this.hotelService.addHotel(formValue).subscribe({
                next: (response) => {
                    console.log('Response data:', response);
                    this.router.navigate(['hotel/tbo-hotel-list']);
                },
                error: (error) => {
                    console.error('API Error:', error);

                    // Show error message to the user
                    this._fuseConfirmationService.open({
                        title: 'Submission Failed',
                        message:
                            error?.error?.message ||
                            'Something went wrong while submitting the form.',
                        actions: {
                            confirm: {
                                show: true,
                                label: 'Ok',
                                color: 'warn',
                            },
                        },
                    });
                },
            });
        } else {
            const formValue = this.hotelForm.value;
            console.log('form control', this.hotelForm);
            console.log(formValue);
            console.log('Form is invalid', formValue);
        }
    }

    update(): void {
        const formValue = this.hotelForm.value;
        console.log(formValue);

        this.hotelService.updateHotel(formValue, this.id).subscribe(() => {
            this.router.navigate(['hotel/tbo-hotel-list']);
        });
    }

    close(): void {
        this.router.navigate(['hotel/tbo-hotel-list']);
    }
}
