import { Component, OnInit } from '@angular/core'; // Import OnInit
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { OfficeInfoModalComponent } from '../office-info-modal/office-info-modal.component';
import { OfficeService } from '../office.service';

@Component({
    selector: 'app-office-info',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCardModule,
    ],
    templateUrl: './office-info.component.html',
    styleUrls: ['./office-info.component.scss'],
})
export class OfficeInfoComponent implements OnInit {
    // Implement OnInit
    contactForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private officeService: OfficeService // Use camelCase for service
    ) {
        this.contactForm = this.fb.group({
            id: [''],
            email: ['', [Validators.required, Validators.email]],
            whatsapp: ['', Validators.required],
            expTime: ['', [Validators.required, Validators.min(1)]],
            phone: ['', Validators.required],
            officeinformation: this.fb.array(this.createInitialOfficeGroups()),
        });
    }

    ngOnInit(): void {
        // Lifecycle hook to fetch data
        this.fetchOfficeData();
    }

    createInitialOfficeGroups() {
        return Array(4)
            .fill(null)
            .map(() => this.createOfficeGroup('', null, ['', '']));
    }

    get officeInformation(): FormArray {
        return this.contactForm.get('officeinformation') as FormArray;
    }

    createOfficeGroup(
        title: string,
        titleExtra: string | null,
        smallText: string[]
    ): FormGroup {
        return this.fb.group({
            title: [title, Validators.required],
            titleExtra: [titleExtra || ''],
            smallText: this.fb.array(
                smallText.map((text) =>
                    this.fb.control(text, Validators.required)
                )
            ),
        });
    }

    openOfficeDialog(index: number): void {
        const officeGroup = this.officeInformation.at(index);

        const dialogRef = this.dialog.open(OfficeInfoModalComponent, {
            data: officeGroup,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.officeInformation.at(index).patchValue(result);
            }
        });
    }

    fetchOfficeData(): void {
        this.officeService.getOfficeData().subscribe({
            next: (data) => {
                console.log('Fetched office data:', data);
                this.patchFormData(data[0]); // Patch the form with the fetched data
            },
            error: (error) => {
                console.error('Error fetching office data:', error);
            },
        });
    }

    patchFormData(data: any): void {
        this.contactForm.patchValue({
            id: data.id,
            email: data.email,
            whatsapp: data.whatsapp,
            expTime: data.expTime,
            phone: data.phone,
        });

        // Patch office information if it exists
        const officeArray = this.officeInformation;
        data.officeinformation.forEach((office: any, index: number) => {
            if (officeArray.at(index)) {
                officeArray.at(index).patchValue({
                    title: office.title,
                    titleExtra: office.titleExtra,
                    smallText: office.smallText,
                });
            }
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            console.log('Form Submitted', this.contactForm.value);

            // Post data to the API
            this.officeService
                .postOfficeData(this.contactForm.value)
                .subscribe({
                    next: (response) => {
                        console.log('Success!', response);
                    },
                    error: (error) => {
                        console.error('Error!', error);
                    },
                });
        } else {
            this.contactForm.markAllAsTouched();
        }
    }
}
