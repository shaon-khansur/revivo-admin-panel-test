import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DestinationService } from '../service/destination.service';
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
      MatGridListModule
  ],
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.scss']
})
export class AddDestinationComponent implements OnInit {
  @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
  form: FormGroup;
  constructor(
      private fb: FormBuilder,
      private destinationService: DestinationService,
      private _dialogRef: MatDialogRef<AddDestinationComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      avatar: [null],
      index: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      price: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      unTitle: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      airport: [null, Validators.required],
      description: [null, Validators.required],
      active: [false]
    });
    
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
    // this.destinationService.uploadAvatar(this.contact.id, file).subscribe();
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


  createDestination(): void {
      this.form.markAllAsTouched();
      if (this.form.valid) {
          this.destinationService.insertDeals(this.form.value).subscribe({
              next: (res: any) => {
                  console.log(console.log(res));
                  this._dialogRef.close(res.data);
              },
          });
      }
  }
}
