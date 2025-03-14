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
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ViewDataComponent } from './view-data/view-data.component';

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
        MatTableModule,
        MatPaginatorModule,
    ],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    selectedFile!: File;
    uploadForm: FormGroup;
    data: any;
    ELEMENT_DATA: any = [];
    dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    displayedColumns: string[] = [
        'title',
        'time',
        'pdfStatus',
        'codeStatus',
        'view',
        'delete',
    ];

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    constructor(
        private uploadService: UploadService,
        private _fuseConfirmationService: FuseConfirmationService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        // Initialize the form with FormBuilder
        this.uploadForm = this.fb.group({
            file: [''],
            code: [''],
            title: ['', Validators.required],
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
        this.uploadService.getHistory().subscribe((response) => {
            console.log(response);
            this.ELEMENT_DATA = response;
            this.dataSource.data = this.ELEMENT_DATA;
        });
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
        this.uploadService.getHistory().subscribe(
            (response) => {
                this.ELEMENT_DATA = response;
                this.dataSource.data = this.ELEMENT_DATA;
            },
            (error: HttpErrorResponse) => {
                this.handleError(error);
            }
        );
    }
    formatDate(timestamp: { _seconds: number; _nanoseconds: number }): string {
        const date = new Date(timestamp._seconds * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        return `${day}-${month}-${year} | ${formattedHours}:${minutes} ${ampm}`;
    }

    // Modified function to upload file
    uploadFile(): void {
        const code = this.uploadForm.get('code')?.value;
        const title = this.uploadForm.get('title')?.value;

        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('pdf', this.selectedFile);

            this.uploadService.uploadPdf(formData).subscribe(
                (response: any) => {
                    // No progress, only response handling
                    this.refreshData();

                    if (response && response.body) {
                        this.uploadSecondStep(response.body, code, title);
                    }
                },
                (error: HttpErrorResponse) => {
                    this.handleError(error);
                }
            );
        } else {
            // If no file is selected, directly call uploadSecondStep
            this.uploadSecondStep('', code, title);
        }
    }

    // New function to handle the second step of the upload
    uploadSecondStep(fileUrl: string, code: string, title: string): void {
        const data = {
            pdfUrl: fileUrl,
            code,
            title,
        };
        if (data.pdfUrl || code) {
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
        } else {
            this._fuseConfirmationService.open({
                title: 'Update Failed',
                message:
                    'The update could not be completed successfully. Please Upload a PDF file or enter the code to proceed.',

                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-circle',
                    color: 'warn',
                },
                actions: {
                    confirm: {
                        show: false,
                        label: 'OK',
                        color: 'primary',
                    },
                },
                dismissible: true, 
            });
        }
    }

    deleteElement(element?: any) {
        if (element) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete History',
                message:
                    'Are you sure you want to delete? This action cannot be undone!',
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
                    this.uploadService.deleteHistory(element.id).subscribe(
                        (response) => {
                            this.ELEMENT_DATA = this.ELEMENT_DATA.filter(
                                (item: any) => item !== element
                            );
                            this.dataSource.data = this.ELEMENT_DATA;
                        },
                        (error: HttpErrorResponse) => {
                            this.handleError(error);
                        }
                    );
                }
            });
        } else {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Delete History',
                message:
                    'Are you sure you want to delete All History of Updates? This action cannot be undone!',
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
                    this.uploadService.deleteHistory().subscribe(
                        (response) => {
                            this.dataSource.data = [];
                        },
                        (error: HttpErrorResponse) => {
                            this.handleError(error);
                        }
                    );
                }
            });
        }
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
            this.uploadForm.get('title')?.setValue('');
            this.uploadForm.get('file')?.setValue('');
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

    openViewDialog(element: any): void {
        this.dialog.open(ViewDataComponent, {
            width: '900px',
            height: '800px',
            data: {
                pdfUrl: element.pdf,
                htmlContent: element.code,
                pdfStatus: element.pdfStatus,
                codeStatus: element.codeStatus,
            },
        });
    }
}
