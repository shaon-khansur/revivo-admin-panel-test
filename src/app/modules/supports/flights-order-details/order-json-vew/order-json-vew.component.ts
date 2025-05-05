import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-order-json-vew',
    standalone: true,
    imports: [CommonModule, MatDialogModule],
    templateUrl: './order-json-vew.component.html',
    styleUrls: ['./order-json-vew.component.scss'],
})
export class OrderJsonVewComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
