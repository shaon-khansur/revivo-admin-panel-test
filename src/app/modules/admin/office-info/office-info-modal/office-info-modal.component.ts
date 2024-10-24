import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-office-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './office-info-modal.component.html',
  styleUrls: ['./office-info-modal.component.scss'],
})
export class OfficeInfoModalComponent {
  officeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OfficeInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup // ensure this is a FormGroup
  ) {
    this.officeForm = this.data; // This should now correctly point to the FormGroup
  }
  

  ngOnInit() {
    console.log('Current Office Form Values:', this.officeForm.value); // Logging the current values for debugging
  }

  get smallTextControls(): FormArray {
    return this.officeForm.get('smallText') as FormArray; // Get the smallText FormArray
  }

  onSave(): void {
    if (this.officeForm.valid) {
      this.dialogRef.close(this.officeForm.value); // close dialog with updated form values
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // just close the dialog without saving
  }
}
