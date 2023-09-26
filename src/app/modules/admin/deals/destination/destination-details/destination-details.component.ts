import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { DestinationListComponent } from '../destination-list/destination-list.component';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
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
    getDownloadURL
  } from '@angular/fire/storage';
  import {initializeApp} from 'firebase/app'
  import { environment } from 'environments/environment';
  
  const fapp = initializeApp(environment.firebase);

@Component({
  selector: 'app-destination-details',
  standalone: true,
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
],
  templateUrl: './destination-details.component.html',
  styleUrls: ['./destination-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationDetailsComponent {
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
      private _destinationsService: DestinationService,
  ) {}
  ngOnInit(): void {
      // Open the drawer
      this._destinationListComponent.matDrawer.open();

      // Create the contact form
      this.form = this._formBuilder.group({
          id: [''],
          avatar: [''],
          name: ['', [Validators.required]],
        //   price: ['', [Validators.required]],
        //   unTitle: ['', [Validators.required]],
          airport: ['', [Validators.required]],
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
          });
  }

  closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._destinationListComponent.matDrawer.close();
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

    // const firebaseApp = getApp();
    const storage = getStorage(fapp);

    const fileRef = ref(storage, `destination/${file.name}`);


    uploadBytesResumable(fileRef, file).on(
        'state_changed',
        (snapshot) => {},
        (error) => {},
        () => {
            console.log('upload complete')
            getDownloadURL(fileRef).then(url => {
                console.log('url', url)

                this.form.get('avatar').setValue(url);
            })
        }
    );

    // Upload the avatar
    // this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
}
  
removeAvatar(): void {
  // Get the form control for 'avatar'
  const avatarFormControl = this.form.get('avatar');

  // Log a message to indicate that the function is being executed
  console.log('Removing avatar...');

  // Set the avatar as null
  avatarFormControl.setValue(null);

  // Log a message to indicate that the avatar form control has been set to null
  console.log('Avatar form control set to null:', avatarFormControl.value);

  // Set the file input value as null
  this._avatarFileInput.nativeElement.value = null;

  // Log a message to indicate that the file input value has been cleared
  console.log('File input value cleared.');
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
                                  this._destinationsService.getAllDestination().subscribe();
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
