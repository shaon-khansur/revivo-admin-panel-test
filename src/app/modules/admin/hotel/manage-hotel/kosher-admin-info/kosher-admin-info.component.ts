import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelService } from '../../hotel.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-kosher-admin-info',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
    ],
    templateUrl: './kosher-admin-info.component.html',
    styleUrls: ['./kosher-admin-info.component.scss'],
})
export class KosherAdminInfoComponent implements OnInit {
    form!: FormGroup;
    loading = true;
    successMessage = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private hotelService: HotelService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
      this.hotelService.getAdminInfo().subscribe({
        next: (data) => {
          this.initForm(data);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load data';
          this.loading = false;
          console.error(err);
        }
      });
    }
    

    initForm(data: any) {
      console.log('Received Data:', data);
      console.log('Title:', data.title);  // Check if title exists 
      this.form = this.fb.group({
        title: [data.title, Validators.required],
        subtitle: [data.subtitle, Validators.required],
        description: [data.description, Validators.required],
        options: this.fb.array(
          data.options.map((option: string) => this.fb.control(option, Validators.required))
        ),
        information: [data.information, Validators.required]
      });
    }
    

    get options(): FormArray {
        return this.form.get('options') as FormArray;
    }

    addOption() {
        this.options.push(this.fb.control('', Validators.required));
    }

    removeOption(index: number) {
        this.options.removeAt(index);
    }

    onSubmit() {
        if (this.form.invalid) return;

        this.hotelService.updateAdminInfo(this.form.value).subscribe({
            next: () => {
              this._fuseConfirmationService.open({
                title: 'Kosher Admin Info updated.',
                message: 'Successfully updated Kosher Admin Info',

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
                title: 'Submission Failed',
                message:
                    err?.error?.message ||
                    'Something went wrong while submitting the form.',
                actions: {
                    confirm: {
                        show: true,
                        label: 'Ok',
                        color: 'warn',
                    },
                },
            });
                console.error(err);
            }
        });
    }
}
