import { Component, Inject, OnInit } from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
} from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-order-details-vew',
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
        MatTableModule,
    ],
    templateUrl: './order-details-vew.component.html',
    styleUrls: ['./order-details-vew.component.scss'],
})
export class OrderDetailsVewComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {}


    getOutboundTravelerName(ticket) {
        const traveler = this.data.outboundIssuanceData.data.travelers.find(el => el.id === ticket.travelerId);
        return `${traveler.name.firstName} ${traveler.name.lastName}`
    }

    getInboundTravelerName(ticket) {
        const traveler = this.data.inboundIssuanceData.data.travelers.find(el => el.id === ticket.travelerId);
        return `${traveler.name.firstName} ${traveler.name.lastName}`
    }
    getRTTravelerName(ticket) {
        const traveler = this.data.outboundIssuanceData.data.travelers.find(el => el.id === ticket.travelerId);
        return `${traveler.name.firstName} ${traveler.name.lastName}`
    }
}
