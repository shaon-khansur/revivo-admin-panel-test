import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HotelService } from '../../../hotel.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-hotel-image',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './edit-hotel-image.component.html',
    styleUrls: ['./edit-hotel-image.component.scss'],
})
export class EditHotelImageComponent {
    form: FormGroup;
    imageUrl: string | ArrayBuffer | null = null;
    fileString: string | ArrayBuffer | null = null;

    constructor(
        private fb: FormBuilder,
        private hotelImageService: HotelService,
        public dialogRef: MatDialogRef<EditHotelImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            ImageTitle: [data.ImageTitle || ''],
            Url: [data.Url || ''],
            ImageType: [data?.ImageType || 'HOTEL'],
            file: [null],
        });
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length > 0) {
            this.uploadThumbnail(input.files);
        } else {
            this.imageUrl = null;
        }
    }

    uploadThumbnail(fileList: FileList): void {
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        if (!allowedTypes.includes(file.type)) {
            console.error('Unsupported file type');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const fileString = event.target?.result as string;
            this.fileString = fileString;
            const base64Image = fileString.split(',')[1];

            this.imageUrl = fileString; // Display the image preview

            const thumbnail = {
                content: base64Image,
                name: file.name,
                type: file.type,
            };
            this.form.get('file')?.patchValue(thumbnail);
        };

        reader.readAsDataURL(file);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            // Provide feedback to the user about form validation issues
            Object.keys(this.form.controls).forEach((field) => {
                const control = this.form.get(field);
                if (control?.invalid) {
                    // Display error message for invalid field
                    console.error(`${field} is invalid`);
                }
            });
            return;
        }

        const formData = this.form.value;

        this.hotelImageService.getHotelImage(formData).subscribe({
            next: (response) => {
                if (response && response.url) {
                    this.form.get('Url')?.setValue(response.url);
                }
                this.dialogRef.close({ action: 'save', data: this.form.value });
            },
            error: (err) => {
                console.error('Error uploading image:', err);
                // Optionally, provide feedback to the user
            },
        });
    }
    onCancel(): void {
        this.dialogRef.close();
    }
    onDelete(): void {
        this.dialogRef.close({ action: 'delete' });
    }
}
