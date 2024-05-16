import { Component, Inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FareFamilyCommissionData } from '../fare-family-commission.component';

interface FareFamilyCommissionFrom {
    id: FormControl<string>;
    type: FormControl<string>;
    amount: FormControl<number>;
}

@Component({
  selector: 'app-fare-family-commissioin-dialog',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,],
  templateUrl: './fare-family-commissioin-dialog.component.html',
  styleUrls: ['./fare-family-commissioin-dialog.component.scss']
})
export class FareFamilyCommissioinDialogComponent {
    fareFamilyCommissionForm: FormGroup<FareFamilyCommissionFrom>;

    providers: { name: string; value: string }[] = [
        { name: 'Amadeus', value: 'AMADEUS' },
        { name: 'ALP', value: 'ALP' },
    ];

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private dialogRef: MatDialogRef<FareFamilyCommissioinDialogComponent>
    ) {}

    ngOnInit(): void {
        this.createForm();
        if (this.dialogData) {
            this.fareFamilyCommissionForm.patchValue(this.dialogData);
        }
    }

    createForm(): void {
        this.fareFamilyCommissionForm = this.fb.group({
            id: [''],
            type: ['', Validators.required],
            amount: [0, Validators.required],

        });
    }

    save() {
        this.dialogRef.close(this.fareFamilyCommissionForm.value as FareFamilyCommissionData);
    }

    close() {
        this.dialogRef.close();
    }
}
