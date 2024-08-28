import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../hotel.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditFacilityComponent } from './edit-facility/edit-facility.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditHotelImageComponent } from './edit-hotel-image/edit-hotel-image.component';

@Component({
    selector: 'app-hotel-details',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatExpansionModule,
        MatDialogModule,
    ],
    templateUrl: './hotel-details.component.html',
    styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent implements OnInit {
    form: FormGroup;
    fileString: string;
    hotelIfo: any; // Ideally, define a proper type for hotelIfo

    constructor(
        private fb: FormBuilder,
        private hotelService: HotelService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const id = params['id'];

            // Initialize the form group
            this.form = this.fb.group({
                id: [''],
                HotelName: [''],
                cityHeb: [''],
                thumbnail: [''],
                HotelRate: [''],
                file: this.fb.group({
                    content: [''],
                    name: [''],
                    type: [''],
                }),
                HotelFacilities: this.fb.array([this.createFacilityGroup()]),
                HotelLocation: this.fb.group({
                    CityCode: [''],
                    CityName: [''],
                    CountryName: [''],
                    Description: [''],
                    Address: this.fb.group({
                        zipcode: [''],
                        phone: [''],
                        street: [''],
                        house_number: [''],
                        fax: [''],
                        email: [''],
                    }),
                    latitude: [''],
                    longitude: [''],
                }),
                HotelRemarks: this.fb.array([]),
                HotelImages: this.fb.array([]),
                Website: [''],
            });

            if (id) {
                this.hotelService.getHotelById(id).subscribe(
                    (hotel) => {
                        this.hotelIfo = hotel;
                        // Patch the form with hotel data
                        this.form.patchValue({
                            id: id,
                            HotelName: hotel.HotelName,
                            cityHeb: hotel.cityHeb,
                            thumbnail: hotel.thumbnail,
                            HotelRate: hotel.HotelRate,
                            Website: hotel.Website,
                            HotelLocation: {
                                CityCode: hotel.HotelLocation?.CityCode || '',
                                CityName: hotel.HotelLocation?.CityName || '',
                                CountryName:
                                    hotel.HotelLocation?.CountryName || '',
                                Description:
                                    hotel.HotelLocation?.Description || '',
                                Address: {
                                    zipcode:
                                        hotel.HotelLocation?.Address?.zipcode ||
                                        '',
                                    phone:
                                        hotel.HotelLocation?.Address?.phone ||
                                        '',
                                    street:
                                        hotel.HotelLocation?.Address?.street ||
                                        '',
                                    house_number:
                                        hotel.HotelLocation?.Address
                                            ?.house_number || '',
                                    fax:
                                        hotel.HotelLocation?.Address?.fax || '',
                                    email:
                                        hotel.HotelLocation?.Address?.email ||
                                        '',
                                },
                                latitude: hotel.HotelLocation?.latitude || '',
                                longitude: hotel.HotelLocation?.longitude || '',
                            },
                        });
                        // Set facilities
                        this.setFacilities(hotel.HotelFacilities || []);
                        // Set hotel remarks
                        this.setHotelRemarks(hotel.HotelRemarks || []);
                        // Set hotel images
                        this.setHotelImages(hotel.HotelImages || []);
                    },
                    (error) => {
                        console.error('Error fetching hotel:', error);
                    }
                );
            }
        });
    }

    get facilities(): FormArray {
        return this.form.get('HotelFacilities') as FormArray;
    }

    get hotelRemarks(): FormArray {
        return this.form.get('HotelRemarks') as FormArray;
    }

    get hotelImages(): FormArray {
        return this.form.get('HotelImages') as FormArray;
    }

    // Helper method to create a facility form group
    private createFacilityGroup(): FormGroup {
        return this.fb.group({
            FacilityTitle: [''],
            FacilityCode: [''],
            FacilityType: [''],
            Url: [''],
        });
    }

    // Helper method to create a hotel remark form group
    private createHotelRemarkGroup(): FormGroup {
        return this.fb.group({
            FreeText: [''],
            RemarkType: [''],
        });
    }

    // Helper method to create a hotel image form group
    private createHotelImageGroup(): FormGroup {
        return this.fb.group({
            ImageTitle: [''],
            Url: [''],
            ImageType: [''],
        });
    }

    // Set facilities in the form array based on the data retrieved
    private setFacilities(facilities: any[]): void {
        this.facilities.clear(); // Clear existing facilities

        facilities.forEach((facility) => {
            this.facilities.push(
                this.fb.group({
                    FacilityTitle: [facility.FacilityTitle || ''],
                    FacilityCode: [facility.FacilityCode || ''],
                    FacilityType: [facility.FacilityType || ''],
                    Url: [facility.Url || ''],
                })
            );
        });

        // Ensure at least one facility input group is present
        if (this.facilities.length === 0) {
            this.facilities.push(this.createFacilityGroup());
        }
    }

    // Set hotel remarks in the form array based on the data retrieved
    private setHotelRemarks(remarks: any[]): void {
        this.hotelRemarks.clear(); // Clear existing remarks

        remarks.forEach((remark) => {
            this.hotelRemarks.push(
                this.fb.group({
                    FreeText: [remark.FreeText || ''],
                    RemarkType: [remark.RemarkType || ''],
                })
            );
        });

        // Ensure at least one remark input group is present
        if (this.hotelRemarks.length === 0) {
            this.hotelRemarks.push(this.createHotelRemarkGroup());
        }
    }

    // Set hotel images in the form array based on the data retrieved
    private setHotelImages(images: any[]): void {
        this.hotelImages.clear(); // Clear existing images

        images.forEach((image) => {
            this.hotelImages.push(
                this.fb.group({
                    ImageTitle: [image.ImageTitle || ''],
                    Url: [image.Url || ''],
                    ImageType: [image.ImageType || ''],
                })
            );
        });

        // Ensure at least one image input group is present
        if (this.hotelImages.length === 0) {
            this.hotelImages.push(this.createHotelImageGroup());
        }
    }

    get thumbnail() {
        return this.form.get('thumbnail').value;
    }

    uploadThumbnail(fileList: FileList): void {
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        if (!allowedTypes.includes(file.type)) {
            // Consider showing an error message
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileString = event.target.result as string;
            this.fileString = fileString;
            const base64Image = fileString.split(',')[1];

            const thumbnail = {
                content: base64Image,
                name: file.name,
                type: file.type,
            };
            this.form.get('file').patchValue(thumbnail);
        };

        reader.readAsDataURL(file);
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

    openEditHotelImage(index: number): void {
        const imageControl = this.hotelImages.at(index);
    
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
                this.hotelImages.at(index).patchValue(result.data);
            } else if (result?.action === 'delete') {
                this.removeImage(index);
            }
        });
    }
    

    update(): void {
        if (this.form.valid) {
            const updatedHotel = this.form.value;
            console.log(updatedHotel);

            this.hotelService.updateHotel(updatedHotel).subscribe(() => {
                this.router.navigate(['hotel/hotel-list']);
            });
        }
    }

    close(): void {
        this.router.navigate(['hotel/hotel-list']);
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
        if (this.facilities.length > 1) {
            this.facilities.removeAt(index);
        }
    }

    addRemark(): void {
        this.hotelRemarks.push(this.createHotelRemarkGroup());
    }

    removeRemark(index: number): void {
        if (this.hotelRemarks.length > 1) {
            this.hotelRemarks.removeAt(index);
        }
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
                this.hotelImages.push(this.fb.group(result.data));
            }
        });
    }

    removeImage(index: number): void {
        if (this.hotelImages.length > 1) {
            this.hotelImages.removeAt(index);
        }
    }
}
