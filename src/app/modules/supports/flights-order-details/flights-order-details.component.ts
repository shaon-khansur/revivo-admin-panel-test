import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsOrderDetailsService } from './flights-order-details.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { OrderJsonVewComponent } from './order-json-vew/order-json-vew.component';

@Component({
    selector: 'app-flights-order-details',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './flights-order-details.component.html',
    styleUrls: ['./flights-order-details.component.scss'],
})
export class FlightsOrderDetailsComponent implements OnInit, AfterViewInit {
    page: number = 0; // Current page index
    limit: number = 10; // Number of items per page
    totalItems: number = 0; // Total number of items from the API
    flightsOrderData: any[] = [];
    dataSource: MatTableDataSource<any[]>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchInputControl = new FormControl('');
    selectByControl = new FormControl('');
    selectBy = [
        { name: 'Top Agt Order ID', value: 'agtOrderId' },
        { name: 'PNR', value: 'pnr' },
    ];
    displayedColumns: string[] = [
        'outboundSource',
        'inboundSource',
        'departure',
        'destination',
        'outboundFlightMode',
        'inboundFlightMode',
        'flightType',
        'agtOrderId',
        'outboundPnr',
        'inboundPnr',
        'orderToSourceStatus',
        'issuanceStatus',
        'orderToSourceDate',
        'view',
    ];
    constructor(
        private flightsOrderDetailsService: FlightsOrderDetailsService,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getFlightsOrderData();

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                if (value && this.selectByControl.value) {
                    this.flightsOrderDetailsService
                        .searchFlightsOrder({
                            searchBy: this.selectByControl.value,
                            value: value,
                        })
                        .subscribe({
                            next: (res) => {
                                this.page = 1;
                                this.limit = 10;
                                this.totalItems = 1;
                                this.flightsOrderData = res;
                                this.dataSource = new MatTableDataSource<any[]>(
                                    this.flightsOrderData
                                );
                            },
                            error: (err) => {
                                console.error(err);
                            },
                        });
                } else if (!value) {
                    this.getFlightsOrderData({page: 0, limit: 10});
                }
            });
    }

    getFlightsOrderData(data?): void {
        const apiData = { page: this.page, limit: this.limit }
        this.flightsOrderDetailsService
            .getFlightsOrder(data ? data : apiData)
            .subscribe({
                next: (res) => {
                    this.page = res.page;
                    this.limit = res.limit;
                    this.totalItems = res.totalItems;
                    this.flightsOrderData = res.data;
                    this.dataSource = new MatTableDataSource<any[]>(
                        this.flightsOrderData
                    );
                },
                error: (err) => {
                    console.error(err);
                },
            });
    }

    ngAfterViewInit() {
        this.paginator.page.subscribe((event) => {
            console.log('event', event);
            this.page = event.pageIndex;
            this.limit = event.pageSize;
            this.flightsOrderDetailsService
                .getFlightsOrder({
                    page: this.page,
                    limit: this.limit,
                })
                .subscribe({
                    next: (res) => {
                        this.page = res.page;
                        this.limit = res.limit;
                        this.totalItems = res.totalItems;
                        this.flightsOrderData = res.data;
                        this.dataSource = new MatTableDataSource<any[]>(
                            this.flightsOrderData
                        );
                    },
                    error: (err) => {
                        console.error(err);
                    },
                });
        });
    }

    getOrderStatus(element) {
        if (
            !element.oneWay &&
            element.outboundDataProvider === 'amadeus' &&
            element.inboundDataProvider === 'amadeus'
        ) {
            if (element.flightType === 'RT') {
                return element.order.data && element.outboundPnr ? true : false;
            } else if (element.flightType === 'twoway') {
                return element.order.outFlightOrder &&
                    element.order.inFlightOrder &&
                    element.outboundPnr &&
                    element.inboundPnr
                    ? true
                    : false;
            } else {
                return 'Not Amadeus';
            }
        }
        if (element.oneWay && element.outboundDataProvider === 'amadeus') {
            return element.order && element.outboundPnr;
        } else {
            return 'Not Amadeus';
        }
    }

    view(element): void {
        this.matDialog.open(OrderJsonVewComponent, { data: element });
    }
}
