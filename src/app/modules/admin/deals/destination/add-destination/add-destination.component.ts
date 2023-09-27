import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DestinationService } from '../service/destination.service';
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL
} from '@angular/fire/storage';
import { initializeApp } from 'firebase/app'
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

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileString = event.target.result as string;
      const base64Image = fileString.split(',')[1];
      
      // Create the avatar object
      const avatar = {
        content: base64Image,
        name: file.name,
        type: file.type
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
        index: this.form.get('index').value,
        airport: this.form.get('airport').value,
        description: this.form.get('description').value,
        active: this.form.get('active').value,
        avatar: avatar
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
