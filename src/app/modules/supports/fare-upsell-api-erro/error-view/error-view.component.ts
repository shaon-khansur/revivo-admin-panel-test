import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { FareUpsellErrorsData } from '../fare-upsell-error.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-error-view',
    standalone: true,
    imports: [CommonModule, MatInputModule, MatDialogModule, MatButtonModule],
    templateUrl: './error-view.component.html',
    styleUrls: ['./error-view.component.scss'],

})
export class ErrorViewComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: FareUpsellErrorsData) {}

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
