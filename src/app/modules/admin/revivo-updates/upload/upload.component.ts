import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
    HttpClient,
    HttpEventType,
    HttpErrorResponse,
} from '@angular/common/http';
import { UploadService } from '../upload.service';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
    ],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;
    selectedFile!: File;
    uploadForm: FormGroup;
    data: any;

    constructor(private uploadService: UploadService, private fb: FormBuilder) {
        // Initialize the form with FormBuilder
        this.uploadForm = this.fb.group({
            file: [''],
            code: [''],
            pdfStatus: [false],
            codeStatus: [false],
        });
    }

    ngOnInit(): void {
        this.uploadService.getData().subscribe(
            (response) => {
                this.data = response;
                this.uploadForm.patchValue({
                    pdfStatus: this.data.pdfStatus,
                    codeStatus: this.data.codeStatus,
                });

                // Listen for changes on pdfStatus
                this.uploadForm
                    .get('pdfStatus')
                    ?.valueChanges.subscribe((pdfStatus: boolean) => {
                        if (pdfStatus) {
                            this.uploadForm.patchValue(
                                { codeStatus: false },
                                { emitEvent: false }
                            );
                        }
                    });

                // Listen for changes on codeStatus
                this.uploadForm
                    .get('codeStatus')
                    ?.valueChanges.subscribe((codeStatus: boolean) => {
                        if (codeStatus) {
                            this.uploadForm.patchValue(
                                { pdfStatus: false },
                                { emitEvent: false }
                            );
                        }
                    });
            },
            (error: HttpErrorResponse) => {
                this.handleError(error);
            }
        );
    }

    triggerFileInput(event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type === 'application/pdf') {
                this.selectedFile = file;
                this.updateDropAreaText(`File Selected: ${file.name}`);
            } else {
                this.updateDropAreaText('Only PDF files are allowed.');
            }
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.updateDropAreaClass('add', 'drag-over');
    }

    onDragLeave(event: DragEvent): void {
        this.updateDropAreaClass('remove', 'drag-over');
    }

    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        this.updateDropAreaClass('remove', 'drag-over');
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                this.selectedFile = file;
                this.updateDropAreaText(`File Selected: ${file.name}`);
            } else {
                this.updateDropAreaText('Only PDF files are allowed.');
            }
        }
    }

    // New function to update statuses
    // New function to update statuses and refresh data
    updateStatus(): void {
        const pdfStatus = this.uploadForm.get('pdfStatus')?.value;
        const codeStatus = this.uploadForm.get('codeStatus')?.value;

        const data = {
            pdfStatus,
            codeStatus,
        };

        this.uploadService.updateStatus(data).subscribe(
            (response) => {
                // After successful update, refresh the data
                this.refreshData(); // Call the refreshData method
            },
            (error: HttpErrorResponse) => {
                this.handleError(error);
            }
        );
    }

    // New function to refresh data after status update
    refreshData(): void {
        this.uploadService.getData().subscribe(
            (response) => {
                this.data = response;
                this.uploadForm.patchValue({
                    pdfStatus: this.data.pdfStatus,
                    codeStatus: this.data.codeStatus,
                });
            },
            (error: HttpErrorResponse) => {
                this.handleError(error);
            }
        );
    }

    // Modified function to upload file
    uploadFile(): void {
        const code = this.uploadForm.get('code')?.value;

        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('pdf', this.selectedFile);

            this.uploadService.uploadPdf(formData).subscribe(
                (response: any) => {
                    // No progress, only response handling
                    this.refreshData();

                    if (response && response.body) {
                        this.uploadSecondStep(response.body, code);
                    }
                },
                (error: HttpErrorResponse) => {
                    this.handleError(error);
                }
            );
        } else {
            // If no file is selected, directly call uploadSecondStep
            this.uploadSecondStep('', code);
        }
    }

    // New function to handle the second step of the upload
    uploadSecondStep(fileUrl: string, code: string): void {
        const data = {
            pdfUrl: fileUrl, // If no file was uploaded, this will be an empty string
            code,
        };
        this.uploadService.upload(data).subscribe(
            (event) => {
                if (event.type === HttpEventType.Response) {
                }
                this.resetForm();
                this.refreshData();
            },
            (error: HttpErrorResponse) => {
                this.handleError(error);
            }
        );
    }

    handleError(error: HttpErrorResponse): void {
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            console.error('Client-side error:', error.error.message);
        } else {
            // Server-side error
            console.error(
                `Server-side error: ${error.status} ${error.message}`
            );
        }
    }

    resetForm(): void {
        setTimeout(() => {
            this.selectedFile = null;
            this.uploadForm.get('code')?.setValue('');
            this.updateDropAreaText('Browse for a PDF file to upload.');
            const inputElement = this.fileInput
                .nativeElement as HTMLInputElement;
            inputElement.value = '';
        }, 5000);
    }

    updateDropAreaText(text: string): void {
        const dropArea = document.querySelector('.file-drop-area p');
        if (dropArea) {
            dropArea.textContent = text;
        }
    }

    updateDropAreaClass(action: 'add' | 'remove', className: string): void {
        const dropArea = document.querySelector('.file-drop-area');
        if (dropArea) {
            dropArea.classList[action](className);
        }
    }
}
