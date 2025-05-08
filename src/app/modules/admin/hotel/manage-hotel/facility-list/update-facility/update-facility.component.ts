import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {
    _MatSlideToggleRequiredValidatorModule,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-update-facility',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        RouterModule,
        _MatSlideToggleRequiredValidatorModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
    templateUrl: './update-facility.component.html',
    styleUrls: ['./update-facility.component.scss'],
})
export class UpdateFacilityComponent {
    form: FormGroup;

    topHotelFeatures = [
        'Private beach / Direct beach access',
        'Terrace / Rooftop terrace',
        'Balcony / Private balcony or terrace',
        'Sea view / Ocean view rooms',
        'Infinity pool / Pool with view',
        'Casino / Casino nearby',
        'Evening entertainment / Live music',
        'Nightclub / DJ / Lounge bar',
        'Tour desk / Concierge services',
        'Free shuttle',
        'Outdoor pool',
        'Indoor heated pool',
        'Jacuzzi / Hot tub / Whirlpool',
        'Spa and wellness centre',
        'Massage / In-room massage',
        'Turkish bath / Hammam / Steam room / Sauna',
        'Fitness center / Gym',
        'Yoga classes / Fitness classes',
        'Bicycles available / Bike tours',
        'Running or walking trails nearby',
        'Air conditioning',
        'Free WiFi',
        'Room service',
        'Kitchenette / Fully equipped kitchen',
        'Blackout curtains / Soundproof rooms',
        'Smart TV / Digital TV service / Streaming',
        'In-room safe / Laptop safe',
        'Complimentary toiletries / Bathrobes / Slippers',
        'Kids’ club / Playground / Babysitting services',
        'Free breakfast / Buffet breakfast',
    ];
    isCustomTag = false;
  customTag = '';

    constructor(
        public dialogRef: MatDialogRef<UpdateFacilityComponent>,
        @Inject(MAT_DIALOG_DATA) public facility: any,
        private fb: FormBuilder
    ) {
        // Initialize the form
        this.form = this.fb.group({
            tag: [this.findMatchingFeature(this.facility?.tag)],
            iconName: [this.facility?.iconName || ''],
            id: facility.id,
        });

        // Update form with consistent, matched data
        this.updateForm(facility);
    }

    enableCustomTag() {
        this.isCustomTag = true;
      }
    
      // Handle selection change and custom tag saving
      onSelectionChange(event: any) {
        // If it's a custom tag, update the form value accordingly
        if (this.isCustomTag && this.customTag) {
          this.form.get('tag')?.setValue(this.customTag);
        }
      }
    
      // Save custom tag once user finishes input (on blur)
      saveCustomTag() {
        if (this.customTag) {
          this.form.get('tag')?.setValue(this.customTag); // Save the custom tag
          this.isCustomTag = false; // Exit custom tag input mode
        }
      }
    

    findMatchingFeature(value: string): string {
        if (!value) return '';
        const match = this.topHotelFeatures.find(
            feature =>
                feature.toLowerCase().replace(/\s+/g, '') ===
                value.toLowerCase().replace(/\s+/g, '')
        );
        return match || '';
    }

    get airportDataArray(): FormArray {
        return this.form.get('airportData') as FormArray;
    }

    updateForm(facility: any): void {
        this.form.patchValue({
            tag: this.findMatchingFeature(facility.tag), // FIXED: ensure tag matches topHotelFeatures
            iconName: facility.iconName,
            id: facility.id,
        });
    }

    onSave(): void {
        if (this.form.valid) {
            this.dialogRef.close({ action: 'save', data: this.form.value });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
