import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
    ],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
    @ViewChild('fileInput') fileInput!: ElementRef;
    selectedFile!: File;
    progress: number = 0;

    constructor(private uploadService: UploadService) {}

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

    uploadFile(): void {
        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('pdf', this.selectedFile);

            this.uploadService.uploadPdf(formData).subscribe(
                (event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(
                            (100 * event.loaded) / event.total!
                        );
                    } else if (event.type === HttpEventType.Response) {
                        console.log('Upload complete:', event.body);
                    }
                    setTimeout(() => {
                        this.progress = 0;
                        this.selectedFile = null!;
                    }, 5000);
                },
                (error: HttpErrorResponse) => {
                    if (error.error instanceof ErrorEvent) {
                        // Client-side error
                        console.error(
                            'Client-side error:',
                            error.error.message
                        );
                    } else {
                        // Server-side error
                        console.error(
                            `Server-side error: ${error.status} ${error.message}`
                        );
                    }
                }
            );
        }
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
