import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    MatChipEditedEvent,
    MatChipInputEvent,
    MatChipsModule,
} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { DestinationService } from '../service/destination.service';
import {
    getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
} from '@angular/fire/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { LiveAnnouncer } from '@angular/cdk/a11y';

const fapp = initializeApp(environment.firebase);

export interface Airports {
    name: string;
}

@Component({
    selector: 'app-add-destination',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatGridListModule,
        MatChipsModule,
    ],
    templateUrl: './add-destination.component.html',
    styleUrls: ['./add-destination.component.scss'],
})
export class AddDestinationComponent implements OnInit {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    form: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    addOnBlur = true;
    announcer = inject(LiveAnnouncer);
    airportChips: string[] = [];
    CityNames: string[] = [];
    dealDestination: string[] = [];

    constructor(
        private fb: FormBuilder,
        private destinationService: DestinationService,
        private _dialogRef: MatDialogRef<AddDestinationComponent>
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            countryName: [null, Validators.required],
            destinationId: [
                '',
                [
                  Validators.required,
                  this.noSlashValidator
                ]
              ],
            hotelStar: [null],
            avatar: [null],
            index: [
                null,
                [Validators.required, Validators.pattern(/^[0-9]+$/)],
            ],
            remark: [null, Validators.required],
            airportCode: [null, Validators.required],
            cityNames: [null, Validators.required],
            dealDestination: [null, Validators.required],
            description: [null, Validators.required],
            active: [false],
            price: [null, Validators.required],
            unTitle: [null, Validators.required],
            discount: [
                null,
                [Validators.required, Validators.pattern(/^[0-9]+$/)],
            ],
        });
    }

    noSlashValidator(control: AbstractControl): ValidationErrors | null {
        const hasSlash = control.value?.includes('/');
        return hasSlash ? { 'hasSlash': true } : null;
    }
    

    addChip(event: any): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.airportChips.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
        this.form.get('airportCode').setValue(this.airportChips);
    }
    addCityNames(event: any): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.CityNames.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
        this.form.get('cityNames').setValue(this.CityNames);
    }
    adddealDestination(event: any): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.dealDestination.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
        this.form.get('dealDestination').setValue(this.dealDestination);
    }

    editChip(index: number, newValue: string): void {
        if (newValue && !this.airportChips.includes(newValue)) {
            this.airportChips[index] = newValue;
        }
    }
    editCityNames(index: number, newValue: string): void {
        if (newValue && !this.CityNames.includes(newValue)) {
            this.CityNames[index] = newValue;
        }
    }
    editdealDestination(index: number, newValue: string): void {
        if (newValue && !this.dealDestination.includes(newValue)) {
            this.dealDestination[index] = newValue;
        }
    }

    removeChip(index: number): void {
        this.airportChips.splice(index, 1);
    }
    removeCityNames(index: number): void {
        this.CityNames.splice(index, 1);
    }
    removedealDestination(index: number): void {
        this.dealDestination.splice(index, 1);
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileString = event.target.result as string;
            const base64Image = fileString.split(',')[1];

            // Create the avatar object
            const avatar = {
                content: base64Image,
                name: file.name,
                type: file.type,
            };

            // Set the avatar object in the form control
            this.form.get('avatar').setValue(avatar, { emitEvent: false }); // Don't emit the change event

            // Use setTimeout to ensure the setValue operation is completed before calling createDestination
            setTimeout(() => {
                this.createDestination();
            }, 0);
        };

        reader.readAsDataURL(file);
    }

    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.form.get('avatar');

        // Clear the selected image and base64 string
        avatarFormControl.setValue(null, { emitEvent: false }); // Don't emit the change event
        this._avatarFileInput.nativeElement.value = null;
    }

    createDestination(): void {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            // Get the avatar object from the form control
            const avatar = this.form.get('avatar').value;

            // Create the destination data including the avatar
            const destinationData = {
                name: this.form.get('name').value,
                countryName: this.form.get('countryName').value,
                destinationId: this.form.get('destinationId').value,
                hotelStar: this.form.get('hotelStar').value,
                index: this.form.get('index').value,
                airportCode: this.form.get('airportCode').value,
                cityNames: this.form.get('cityNames').value,
                dealDestination: this.form.get('dealDestination').value,
                description: this.form.get('description').value,
                remark: this.form.get('remark').value,
                active: this.form.get('active').value,
                price: this.form.get('price').value,
                unTitle: this.form.get('unTitle').value,
                discount: this.form.get('discount').value,
                avatar: avatar,
            };

            this.destinationService.insertDeals(destinationData).subscribe({
                next: (res: any) => {
                    console.log(res);
                    this._dialogRef.close(res.data);
                },
            });
        }
    }
}
