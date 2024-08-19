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
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
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
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { getAuth, Auth } from '@angular/fire/auth';

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
import { HotelListComponent } from '../hotel-list/hotel-list.component';
import { HotelService } from '../../hotel.service';

@Component({
    selector: 'app-hotel-details',
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
    templateUrl: './hotel-details.component.html',
    styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent {
    @ViewChild(MatSidenav) drawer: MatSidenav | undefined;
    addOnBlur = true;
    announcer = inject(LiveAnnouncer);
    editMode: boolean = false;
    hotel: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _hotelListComponent: HotelListComponent,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _hotelService: HotelService,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._hotelListComponent.matDrawer.open();

        this._activatedRoute.params
            .pipe(
                switchMap((params) => {
                    console.log(params);

                    const hotelId = +params['hotelID'];
                    console.log('Hotel ID from params:', hotelId);

                    if (hotelId) {
                        return this._hotelService.getHotelById(hotelId).pipe(
                            tap((hotel) => {
                                console.log(hotel);
                                this.hotel = hotel;
                                this._changeDetectorRef.markForCheck();
                            }),
                            catchError((err) => {
                                console.error(
                                    'Error fetching hotel details:',
                                    err
                                );
                                return of(null);
                            })
                        );
                    }
                    return of(null); 
                })
            )
            .subscribe();
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
    // Method to close the drawer if it's open
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._hotelListComponent.matDrawer.close();
    }
}
