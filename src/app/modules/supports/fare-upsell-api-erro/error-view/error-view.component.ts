import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FareUpsellErrorsData } from '../fare-upsell-error.service';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-error-view',
    standalone: true,
    imports: [CommonModule, MatInputModule],
    templateUrl: './error-view.component.html',
    styleUrls: ['./error-view.component.scss'],
})
export class ErrorViewComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: FareUpsellErrorsData) {}

    get payloadValue(): string {
        return JSON.stringify(this.data.payload);
    }
    get apiErrorValue(): string {
        return JSON.stringify(this.data.apiError);
    }

    ngOnInit(): void {
        console.log('dialog data', this.data);
    }
}
