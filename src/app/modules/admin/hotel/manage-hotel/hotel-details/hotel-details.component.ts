import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelService } from '../../hotel.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-hotel-details',
    standalone: true,
    inputs: ['ngForTrack'],
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    templateUrl: './hotel-details.component.html',
    styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent {
    form: FormGroup;
    fileString;
    constructor( private fb: FormBuilder,
        private dialogRef: MatDialogRef<HotelDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) private dialogData: any) {}

        ngOnInit(): void {
            this.form = this.fb.group({
                HotelName: [''],
                thumbnail: [''],
                Website: [''],
                HotelRate:[''],
                file: this.fb.group({
                    content: [''],
                    name: [''],
                    type: [''],
                }),
            });
    
            if (this.dialogData) {
                console.log('dialogData', this.dialogData)
                this.form.patchValue(this.dialogData)
            }
        }
        get thumbnail() {
            return this.form.get('thumbnail').value;
        }
    
        uploadThumbnail(fileList: FileList): void {
            let thumbnail;
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
                this.fileString = fileString;
                console.log('flileString', fileString)
                const base64Image = fileString.split(',')[1];
    
    
                // Create the avatar object
                thumbnail = {
                    content: base64Image,
                    name: file.name,
                    type: file.type,
                };
                this.form.get('file').patchValue(thumbnail);
    
                console.log('thumbnail inside',thumbnail);
                console.log('thumbnail inside', this.form.value);
            };
    
            reader.readAsDataURL(file);
    
            console.log('thumbnail', thumbnail);
        }
        update(): void {
            this.dialogRef.close(this.form.value)
        }
    
        close(): void {
            console.log(this.form.value)
            console.log(JSON.stringify(this.form.value))
            this.dialogRef.close(null)
        }
}
