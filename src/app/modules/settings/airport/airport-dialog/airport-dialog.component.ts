import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-airport-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './airport-dialog.component.html',
    styleUrls: ['./airport-dialog.component.scss'],
})
export class AirportDialogComponent implements OnInit {
    form: FormGroup;

    constructor(
        private matDialogRef: MatDialogRef<AirportDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private dialogData: any
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
            country: [''],
            city: [''],
            cityHibrew: [''],
            iata: [''],
            state: [''],
        });

        if (this.dialogData) {
            this.form.patchValue(this.dialogData);
        }
    }

    update(): void {
        this.matDialogRef.close(this.form.value);
    }

    close(): void {
        this.matDialogRef.close(null);
    }
}
