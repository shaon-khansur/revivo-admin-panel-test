import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { DestinationListComponent } from '../destination-list/destination-list.component';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DestinationService } from '../service/destination.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { getAuth, Auth } from '@angular/fire/auth';
import { Destination } from '../destination';

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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    MatChipEditedEvent,
    MatChipInputEvent,
    MatChipsModule,
} from '@angular/material/chips';

const fapp = initializeApp(environment.firebase);

export interface Airports {
    name: string;
}

@Component({
    selector: 'app-destination-details',
    standalone: true,
    inputs: ['ngForTrack'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        TextFieldModule,
        MatRippleModule,
        MatOptionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        RouterLink,
        FuseFindByKeyPipe,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgFor,
        NgClass,
        NgIf,
        MatChipsModule,
    ],
    templateUrl: './destination-details.component.html',
    styleUrls: ['./destination-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationDetailsComponent {
    airportCodes: string[];
    cityNames: string[];
    dealDestination: string[];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    addOnBlur = true;
    announcer = inject(LiveAnnouncer);

    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    destination: Destination;
    destinations: Destination[];
    editMode: boolean = false;
    form: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _destinationListComponent: DestinationListComponent,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _destinationsService: DestinationService
    ) {}
    ngOnInit(): void {
        // Open the drawer
        this._destinationListComponent.matDrawer.open();

        // Create the contact form
        this.form = this._formBuilder.group({
            id: [''],
            avatar: [''],
            name: ['', [Validators.required]],
            countryName: ['', [Validators.required]],
            destinationId: [
                '',
                [
                  Validators.required,
                  this.noSlashValidator
                ]
              ],
            hotelStar: ['', [Validators.required]],
            price: ['', [Validators.required]],
            unTitle: ['', [Validators.required]],
            discount: ['', [Validators.required]],
            remark: ['', [Validators.required]],
            airportCode: ['', [Validators.required]],
            cityNames: ['', [Validators.required]],
            dealDestination: ['', [Validators.required]],
            description: ['', [Validators.required]],
            active: ['', [Validators.required]],
        });

        this._destinationsService.destinations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((destinations: Destination[]) => {
                this.destinations = destinations;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._destinationsService.destination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: Destination) => {
                // Open the drawer in case it is closed
                this._destinationListComponent.matDrawer.open();

                // Get the contact
                this.destination = user;
                this.airportCodes = this.destination.airportCode;
                this.cityNames = this.destination.cityNames;
                this.dealDestination = this.destination.dealDestination;

                // Clear the emails and phoneNumbers form arrays
                // (this.contactForm.get('emails') as UntypedFormArray).clear();
                // (
                //     this.contactForm.get('phoneNumbers') as UntypedFormArray
                // ).clear();

                // Patch values to the form
                this.form.patchValue(user);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();

                console.log(this.destination);
            });
    }

    noSlashValidator(control: AbstractControl): ValidationErrors | null {
        const hasSlash = control.value?.includes('/');
        return hasSlash ? { 'hasSlash': true } : null;
    }

    addChip(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.airportCodes.push(value);
        }
        event.chipInput!.clear();
    }
    addCityName(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.cityNames.push(value);
        }
        event.chipInput!.clear();
    }
    adddealDestination(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.dealDestination.push(value);
        }
        event.chipInput!.clear();
    }

    editChip(code: string, event: MatChipEditedEvent) {
        const value = event.value.trim();
        if (!value) {
            this.removeChip(code);
            return;
        }
        const index = this.airportCodes.indexOf(code);
        if (index >= 0) {
            this.airportCodes[index] = value;
        }
    }
    editCityName(code: string, event: MatChipEditedEvent) {
        const value = event.value.trim();
        if (!value) {
            this.removeCityName(code);
            return;
        }
        const index = this.cityNames.indexOf(code);
        if (index >= 0) {
            this.cityNames[index] = value;
        }
    }
    editdealDestination(code: string, event: MatChipEditedEvent) {
        const value = event.value.trim();
        if (!value) {
            this.removedealDestination(code);
            return;
        }
        const index = this.dealDestination.indexOf(code);
        if (index >= 0) {
            this.dealDestination[index] = value;
        }
    }

    removeChip(code: string): void {
        const index = this.airportCodes.indexOf(code);

        if (index >= 0) {
            this.airportCodes.splice(index, 1);

            // Announce the removal
            this.announcer.announce(`Removed ${code}`);
        }
    }
    removeCityName(code: string): void {
        const index = this.cityNames.indexOf(code);

        if (index >= 0) {
            this.cityNames.splice(index, 1);

            // Announce the removal
            this.announcer.announce(`Removed ${code}`);
        }
    }
    removedealDestination(code: string): void {
        const index = this.dealDestination.indexOf(code);

        if (index >= 0) {
            this.dealDestination.splice(index, 1);

            this.announcer.announce(`Removed ${code}`);
        }
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._destinationListComponent.matDrawer.close();
    }

    deleteDestination(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete destination',
            message:
                'Are you sure you want to delete this destination? This action cannot be undone!',
            actions: {
                confirm: {
                    show: true,
                    label: 'Ok',
                    color: 'primary',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._destinationsService
                    .deleteDestination(this.form.value.id)
                    .subscribe({
                        next: (res) => {
                            this._destinationListComponent.matDrawer
                                .close()
                                .then(() => {
                                    this._destinationsService
                                        .getAllDestination()
                                        .subscribe();
                                });
                            this._changeDetectorRef.markForCheck();
                        },
                    });
            }
        });
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
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

            this.form.get('avatar').setValue(avatar, { emitEvent: false });
        };

        reader.readAsDataURL(file);
    }

    removeAvatar(): void {
        const avatarFormControl = this.form.get('avatar');

        avatarFormControl.setValue(null, { emitEvent: false }); // Don't emit the change event
        this._avatarFileInput.nativeElement.value = null;
    }

    // removeAvatar(): void {
    //   // Get the form control for 'avatar'
    //   const avatarFormControl = this.form.get('avatar');

    //   // Log a message to indicate that the function is being executed
    //   console.log('Removing avatar...');

    //   // Set the avatar as null
    //   avatarFormControl.setValue(null);

    //   // Log a message to indicate that the avatar form control has been set to null
    //   console.log('Avatar form control set to null:', avatarFormControl.value);

    //   // Set the file input value as null
    //   this._avatarFileInput.nativeElement.value = null;

    //   // Log a message to indicate that the file input value has been cleared
    //   console.log('File input value cleared.');
    // }

    updateDestination(): void {
        this._destinationsService
            .updateDestination(this.form.value.id, this.form.value)
            .subscribe({
                next: (res) => {
                    this._destinationsService.getAllDestination().subscribe();
                    this._fuseConfirmationService.open({
                        title: 'Destination updated.',
                        message: 'Successfuly updated destination',

                        icon: {
                            show: true,
                            name: 'heroicons_outline:check',
                            color: 'accent',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Ok',
                                color: 'primary',
                            },
                        },
                        dismissible: false,
                    });
                },
                error: (err) => {
                    this._fuseConfirmationService.open({
                        title: 'Destination updated.',
                        message: 'Successfuly updated destination',

                        icon: {
                            show: true,
                            name: 'heroicons_outline:check',
                            color: 'warn',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'Ok',
                                color: 'primary',
                            },
                        },
                        dismissible: false,
                    });
                },
            });
    }
}
