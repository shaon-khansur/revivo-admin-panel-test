import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FareUpsellErrorService } from './fare-upsell-error.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorViewComponent } from './error-view/error-view.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
        MatPaginatorModule,
    ],
    templateUrl: './fare-upsell-api-erro.component.html',
    styleUrls: ['./fare-upsell-api-erro.component.scss'],
})
export class FareUpsellApiErroComponent implements OnInit {
    fareUpsellService = inject(FareUpsellErrorService);
    fareUpsellErrorsData: any[] = [];
    dataSource: MatTableDataSource<any[]>;
    totalItems: number = 0; // Total number of items from the API
    limit: number = 10; // Number of items per page
    page: number = 0; // Current page index

    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(private matDialog: MatDialog) {}

    displayedColumns: string[] = [
        'date',
        'amaCref',
        'itineraries',
        'error',
        'retry',
        'count',
        'status',
        'view',
    ];

    ngOnInit(): void {
        this.getFareUpsellErrorsData({ page: this.page, limit: this.limit });
    }

    getFareUpsellErrorsData(data: { page: number; limit: number }): void {
        this.fareUpsellService
            .getFareUpsellErrorsData({ page: data.page, limit: data.limit })
            .subscribe({
                next: (res) => {
                    this.fareUpsellErrorsData = res?.data;
                    this.dataSource = new MatTableDataSource<any[]>(
                        this.fareUpsellErrorsData
                    );
                    this.totalItems = res.totalItems;
                },
                error: (err) => {
                    console.log('fareupsellErrorData erro', err);
                },
            });
    }

    ngAfterViewInit() {
        this.paginator.page.subscribe((event) => {
            this.page = event.pageIndex;
            this.limit = event.pageSize;
            this.getFareUpsellErrorsData({
                page: this.page,
                limit: this.limit,
            });
        });
    }

    public convertTimestampToDate(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toISOString();
    }

    view(rowData): void {
        this.matDialog.open(ErrorViewComponent, { data: rowData });
    }

    getItineraries(data: {
        flightOffers: any[];
        type: 'flight-offers-upselling';
    }) {
        let departure = '';
        let arrival = '';
        data.flightOffers.forEach((offer) => {
            offer.itineraries.forEach((iti) => {
                for (let i = 0; i < iti.segments.length; i++) {
                    if (i === 0) {
                        departure = iti.segments[0].departure.iataCode;
                    }
                    if (i === iti.segments.length - 1) {
                        arrival = iti.segments[i].arrival.iataCode;
                    }
                }
            });
        });

        return `${departure} -> ${arrival}`;
    }

    getAmaClient(element): string {
        if (element.apiError) {
            return element.apiError.headers['ama-client-ref'];
        } else {
            return 'N/A';
        }
    }

    getApiErrorMessafe(error): string {
        return error.data.errors[0].title;
    }
}
