import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CreateOrderErrorData } from '../create-order-error.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-error-dialog',
    standalone: true,
    imports: [CommonModule, MatInputModule, MatDialogModule, MatButtonModule],
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: CreateOrderErrorData) {}

    get payloadValue(): string {
        return JSON.stringify(this.data.payload);
    }
    get apiResponse(): string {
        if (this.data.success) {
            return JSON.stringify(this.data.response);
        }
        return JSON.stringify(this.data.apiError);
    }

    ngOnInit(): void {
        console.log('dialog data', this.data);
    }
}
