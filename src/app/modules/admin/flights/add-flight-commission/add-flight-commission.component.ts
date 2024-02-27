import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
} from '@angular/common';

import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

interface CommissionFrom {
    id: FormControl<string>;
    airline: FormControl<string>;
    outboundAirport: FormControl<string>;
    outboundCommission: FormControl<number>;
    inboundAirport: FormControl<string>;
    inboundCommission: FormControl<number>;
    provider: FormControl<string>;
    default: FormControl<boolean>;
}
@Component({
    selector: 'app-add-flight-commission',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
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
        MatChipsModule,
    ],
    templateUrl: './add-flight-commission.component.html',
    styleUrls: ['./add-flight-commission.component.scss'],
})
export class AddFlightCommissionComponent implements OnInit {
    commissionForm: FormGroup<CommissionFrom>;

    providers: { name: string; value: string }[] = [
        { name: 'Amadeus', value: 'AMADEUS' },
        { name: 'ALP', value: 'ALP' },
    ];

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private dialogRef: MatDialogRef<AddFlightCommissionComponent>
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
            provider: ['', Validators.required],
        });
    }

    save() {
        this.dialogRef.close(this.commissionForm.value);
    }

    close() {
        this.dialogRef.close();
    }
}
