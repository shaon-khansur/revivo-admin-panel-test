import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareUpsellErrorService } from './fare-upsell-error.service';
import { MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorViewComponent } from './error-view/error-view.component';

@Component({
    selector: 'app-fare-upsell-api-erro',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
    ],
    templateUrl: './fare-upsell-api-erro.component.html',
    styleUrls: ['./fare-upsell-api-erro.component.scss'],
})
export class FareUpsellApiErroComponent implements OnInit {
    fareUpsellService = inject(FareUpsellErrorService);
    constructor(private matDialog: MatDialog) {}

    displayedColumns: string[] = ['date', 'itineraries',  'error', 'retry', 'count', 'status', 'view'];
    dataSource: any[] = [];

    ngOnInit(): void {
        this.fareUpsellService.getFareUpsellErrorsData().subscribe({
            next: (res) => {
                this.dataSource = res.sort(
                    (a, b) =>
                        new Date(b.timeStamp).getTime() -
                        new Date(a.timeStamp).getTime()
                );
                console.log('fa', res)
            },
            error: (err) => {
                console.log('fareupsellErrorData erro', err);
            },
        });
    }

    public convertTimestampToDate(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toISOString();
    }

    view(rowData): void {
        this.matDialog.open(ErrorViewComponent, { data: rowData });
    }

    getItineraries(data: {flightOffers: any[], type: 'flight-offers-upselling'}) {
        let departure = '';
        let arrival = '';
        data.flightOffers.forEach(offer => {
            offer.itineraries.forEach(iti => {
                for (let i = 0; i < iti.segments.length; i++) {
                    if (i === 0) {
                        departure = iti.segments[0].departure.iataCode;
                    }
                    if (i === iti.segments.length - 1) {
                        arrival = iti.segments[i].arrival.iataCode;
                    }
                }
            })
        })

        return `${departure} -> ${arrival}`
    }
}
