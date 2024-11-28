import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardComponent } from '@fuse/components/card';
@Component({
    selector: 'app-room-descriptions',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatExpansionModule,
        MatDialogModule,
        MatIconModule,
        MatDividerModule,
        MatMenuModule,
        MatTooltipModule,
        FuseCardComponent,
    ],
    templateUrl: './room-descriptions.component.html',
    styleUrls: ['./room-descriptions.component.scss'],
})
export class RoomDescriptionsComponent implements OnInit {
    @Input() roomsDescriptionForm!: FormGroup;
    roomCategories: any[] = [];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        if (!this.roomsDescriptionForm) {
            // If no form is passed, create a default form
            this.roomsDescriptionForm = this.fb.group({
                package_type: ['', Validators.required],
                remarks: ['', Validators.required],
                selected_category: ['', Validators.required],
                complects: this.fb.array([]),
                infantPrice: this.fb.array([
                    this.createInfantPrice('', ''),
                ]),
                additionalPayments: this.fb.array([]),
                dealData: this.fb.array([]),
                restrictions: [''],
                supplements: [''],
                taxes: ['', Validators.required],
            });
        }
    }
    // Method to create an infant price control
    createInfantPrice(currency: string, price: string): FormGroup {
        return this.fb.group({
            currency: [currency, Validators.required],
            price: [price, Validators.required],
        });
    }

    // Method to add a new currency-price pair
    addInfantPrice(currency: string, price: string): void {
        const infantPriceArray = this.roomsDescriptionForm.get(
            'infantPrice'
        ) as FormArray;
        infantPriceArray.push(this.createInfantPrice(currency, price));
    }


    // Method to add a new additional payment entry
addAdditionalPayment(): void {
  const additionalPaymentsArray = this.roomsDescriptionForm.get('additionalPayments') as FormArray;
  additionalPaymentsArray.push(this.createAdditionalPayment('', '', '', ''));
}

// Method to create an additional payment FormGroup
createAdditionalPayment(restriction: string, value: string, rule: string, summ: string): FormGroup {
  return this.fb.group({
      restriction: [restriction, Validators.required],
      value: [value, Validators.required],
      rule: [rule, Validators.required],
      summ: [summ, Validators.required],
  });
}
// Method to remove an additional payment entry
removeAdditionalPayment(index: number): void {
  const additionalPaymentsArray = this.roomsDescriptionForm.get('additionalPayments') as FormArray;
  additionalPaymentsArray.removeAt(index);
}


}
