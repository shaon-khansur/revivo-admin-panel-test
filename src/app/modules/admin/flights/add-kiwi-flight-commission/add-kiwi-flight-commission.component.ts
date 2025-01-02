import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

interface CommissionFrom {
    id: FormControl<string>;
    airline: FormControl<string>;
    outboundAirport: FormControl<string>;
    outboundCommission: FormControl<number>;
    inboundAirport: FormControl<string>;
    inboundCommission: FormControl<number>;
    default: FormControl<boolean>;
}

@Component({
    selector: 'app-add-kiwi-flight-commission',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSelectModule,
        MatChipsModule,
    ],
    templateUrl: './add-kiwi-flight-commission.component.html',
    styleUrls: ['./add-kiwi-flight-commission.component.scss'],
})
export class AddKiwiFlightCommissionComponent {
    commissionForm: FormGroup<CommissionFrom>;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private dialogRef: MatDialogRef<AddKiwiFlightCommissionComponent>
    ) {}

    ngOnInit(): void {
        this.createForm();
        if (this.dialogData) {
            this.commissionForm.patchValue(this.dialogData);
        }
    }

    createForm(): void {
        this.commissionForm = this.fb.group({
            id: [''],
            airline: ['', Validators.required],
            outboundCommission: [0, Validators.required],
            outboundAirport: ['', Validators.required],
            inboundCommission: [0, Validators.required],
            inboundAirport: ['', Validators.required],
            default: [false, Validators.required],
        });
    }

    save() {
        this.dialogRef.close(this.commissionForm.value);
    }

    close() {
        this.dialogRef.close();
    }
}
