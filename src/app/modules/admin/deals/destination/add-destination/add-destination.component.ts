import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DestinationService } from '../service/destination.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-destination',
  standalone: true,
  imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatInputModule,
      MatCheckboxModule
  ],
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.scss']
})
export class AddDestinationComponent implements OnInit {
  form: FormGroup;
  constructor(
      private fb: FormBuilder,
      private destinationService: DestinationService,
      private _dialogRef: MatDialogRef<AddDestinationComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      index: [null, Validators.required],
      active: [false]
    });
  }

  createDestinantion(): void {
      this.form.markAllAsTouched();
      if (this.form.valid) {
          this.destinationService.insertDeals(this.form.value).subscribe({
              next: (res: any) => {
                  console.log(console.log(res));
                  this._dialogRef.close(res.data);
                  Swal.fire("Success", res.message, "success");
              },
          });
      }
  }
}
