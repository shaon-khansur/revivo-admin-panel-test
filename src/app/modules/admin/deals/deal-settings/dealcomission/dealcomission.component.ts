import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealsettingsService } from '../../destination/service/deal/dealsettings.service';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-dealcomission',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        TextFieldModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './dealcomission.component.html',
    styleUrls: ['./dealcomission.component.scss'],
})
export class DealcomissionComponent implements OnInit {
    dealSettings: any;
    form: FormGroup;

    constructor(
        private dealService: DealsettingsService,
        private fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.initializeForm();
    }

    ngOnInit(): void {
        this.dealService.getDealSettings().subscribe((data) => {
            this.dealSettings = data;
            console.log('Deal Settings:', this.dealSettings);
            this.initializeForm();
        });
    }

    initializeForm(): void {
        this.form = this.fb.group({
            commission1: [
                (this.dealSettings && this.dealSettings[0]?.commission1) || 0,
            ],
            commission2: [
                (this.dealSettings && this.dealSettings[0]?.commission2) || 0,
            ],
            dealFee: [
                (this.dealSettings && this.dealSettings[0]?.dealsFee) || 0,
            ],
        });
    }

    get commission1(): FormControl {
        return this.form.get('commission1') as FormControl;
    }

    get commission2(): FormControl {
        return this.form.get('commission2') as FormControl;
    }

    get dealFee(): FormControl {
        return this.form.get('dealFee') as FormControl;
    }

    onSave(): void {
        if (this.form.valid) {
            const formData = {
                commission1: parseInt(this.form.value.commission1, 10),
                commission2: parseInt(this.form.value.commission2, 10),
                dealFee: parseInt(this.form.value.dealFee, 10),
            };
            console.log('formdata before post', formData);

            this.dealService.saveDealSettings(formData).subscribe(
                (response) => {
                    console.log('form response', response);
                    this._fuseConfirmationService.open({
                        title: 'Deal Settings updated.',
                        message: 'Successfully updated deal settings',

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
                (error) => {
                    console.error('Error saving deal settings:', error);
                    this._fuseConfirmationService.open({
                        title: 'Deal Settings not saved.',
                        message: 'Updated deal settings Failed',

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
                }
            );
        } else {
            console.log('Form is invalid. Please correct the errors.');
        }
    }
}
