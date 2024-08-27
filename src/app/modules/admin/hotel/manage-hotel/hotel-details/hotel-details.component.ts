import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../hotel.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

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
        MatExpansionModule
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
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            
            // Initialize the form group
            this.form = this.fb.group({
                id: [''],
                HotelName: [''],
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
                            thumbnail: hotel.thumbnail,
                            AboutHotel: hotel.AboutHotel,
                            HotelRate: hotel.HotelRate,
                            Website: hotel.Website,
                            HotelLocation: {
                                CityCode: hotel.HotelLocation?.CityCode || '',
                                CityName: hotel.HotelLocation?.CityName || '',
                                CountryName: hotel.HotelLocation?.CountryName || '',
                                Description: hotel.HotelLocation?.Description || '',
                                Address: {
                                    zipcode: hotel.HotelLocation?.Address?.zipcode || '',
                                    phone: hotel.HotelLocation?.Address?.phone || '',
                                    street: hotel.HotelLocation?.Address?.street || '',
                                    house_number: hotel.HotelLocation?.Address?.house_number || '',
                                    fax: hotel.HotelLocation?.Address?.fax || '',
                                    email: hotel.HotelLocation?.Address?.email || '',
                                },
                                latitude: hotel.HotelLocation?.latitude || '',
                                longitude: hotel.HotelLocation?.longitude || '',
                            },
                        });
                        // Set facilities
                        this.setFacilities(hotel.HotelFacilities || []);
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

    // Helper method to create a facility form group
    private createFacilityGroup(): FormGroup {
        return this.fb.group({
            FacilityTitle: [''],
            FacilityCode: [''],
            FacilityType: [''],
            Url: [''],
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
        this.facilities.push(this.createFacilityGroup());
    }

    removeFacility(index: number): void {
        if (this.facilities.length > 1) {
            this.facilities.removeAt(index);
        }
    }
}
