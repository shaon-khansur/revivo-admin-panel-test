import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
    ngOnInit(): void {
        console.log(this.data);
    }
}
