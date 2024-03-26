import { Component, OnInit, ViewChild } from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
} from '@angular/common';
import {
    AmaFlightOrderService,
    OrderIDS,
} from '../services/ama-flight-order-service/ama-flight-order.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTable, MatTableModule } from '@angular/material/table';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { catchError, concatMap, filter, forkJoin, from, map, of, toArray } from 'rxjs';

@Component({
    selector: 'app-orders',
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
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
    amaFlightOrderData: any[] = [];
    displayedColumns: string[] = [
        'outbound',
        'inbound',
        'pnr',
        'flightMode',
        'date',
        'returnDate',
        'provider',
        'flightType',
        'view',
    ];
    dataSource: any[];

    @ViewChild('amaFlightOrderTable') table: MatTable<any[]>;
    constructor(
        private amaFlightOrderService: AmaFlightOrderService,
        private _fuseConfirmationDialog: FuseConfirmationService
    ) {}
    ngOnInit(): void {
        this.getFlightOrders();
    }

    getFlightOrders(): void {
        this.amaFlightOrderService.getAllOrders().pipe(
            concatMap(res => from(res.data)),
            // map((order: any) => {
            //     if (order.oneWay == false && order.orderComplete === true) {
            //         order['order'] = [order.inFlightOrder.data, order.outFlightOrder.data]
            //     }
            // }),
            filter((el: {orderComplete: boolean}) => el?.orderComplete == true),
            toArray(),
        ).subscribe({
            next: (response) => {
                this.amaFlightOrderData = response;
                this.dataSource = this.amaFlightOrderData;
                console.log('amaFlightOrders', this.amaFlightOrderData);
            },
        });
    }

    getPnr(element) {
        if (element.oneWay == false && element.flightType != "RT") {
            let outPNR: any[] = [];
            let inPNR: any[] = [];
            //two way flights
            if (element.order.outFlightOrder.data.associatedRecords.length > 1) {
                const sorted = element.order.associatedRecords
                    .sort((a, b) => {
                        return a.flightOfferId - b.flightOfferId;
                    })
                    .map((el) => el.reference);
                outPNR = sorted;
            } else {
                const sorted = element.order.outFlightOrder.data.associatedRecords.map(
                    (el) => el.reference
                );
                outPNR = sorted;
            }

            if (element.order.inFlightOrder.data.associatedRecords.length > 1) {
                const sorted = element.order.associatedRecords
                    .sort((a, b) => {
                        return a.flightOfferId - b.flightOfferId;
                    })
                    .map((el) => el.reference);
                inPNR = sorted;
            } else {
                const sorted = element.order.inFlightOrder.data.associatedRecords.map(
                    (el) => el.reference
                );
                inPNR = sorted;
            }

            return {outbound: outPNR, inbound: inPNR}
        } else if (element.oneWay == false && element.flightType === "RT") {
            if (element.order.associatedRecords.length > 1) {
                const sorted = element.order.associatedRecords
                    .sort((a, b) => {
                        return a.flightOfferId - b.flightOfferId;
                    })
                    .map((el) => el.reference);
                return {round: sorted};
            } else {
                const sorted = element.order.associatedRecords.map(
                    (el) => el.reference
                );
                return {round: sorted}
            }
        } else {
            //One way flights
            if (element.order.associatedRecords.length > 1) {
                const sorted = element.order.associatedRecords
                    .sort((a, b) => {
                        return a.flightOfferId - b.flightOfferId;
                    })
                    .map((el) => el.reference);
                return {outbound: sorted};
            } else {
                const sorted = element.order.associatedRecords.map(
                    (el) => el.reference
                );
                return {outbound: sorted};
            }
        }

    }

    edit(data) {
        console.log(data);
    }

    delete(data) {
        const confirmation = this._fuseConfirmationDialog.open({
            title: 'Delete data',
            message:
                'Are you sure you want to delete? This action cannot be undone!',
            actions: {
                confirm: {
                    show: true,
                    label: 'Ok',
                    color: 'primary',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                if (data.oneWay === true) {
                    this.amaFlightOrderService.deleteAmadeusFlightOrder({
                        id: data.id,
                        amadeusOrderId: data.order.id,
                    } as OrderIDS)
                    .subscribe({
                        next: (res) => {
                            this.getFlightOrders();
                            console.log('d-->', res);
                        },
                        error: (err) => {
                            console.log('err-->', err);
                        },
                    });
                } else if (data.oneWay === false && data.flightType !== "RT") {
                    forkJoin([
                        this.amaFlightOrderService.deleteAmadeusFlightOrder({
                            id: data.id,
                            amadeusOrderId: data.order.outFlightOrder.data.id,
                        } as OrderIDS).pipe(catchError(e => of('outFlightOrder Error'))),

                        this.amaFlightOrderService.deleteAmadeusFlightOrder({
                            id: data.id,
                            amadeusOrderId: data.order.inFlightOrder.data.id,
                        } as OrderIDS).pipe(catchError(e => of('inFlightOrder Error')))
                    ]).subscribe({
                        next: (res) => {
                            this.getFlightOrders();
                            console.log('d-->', res);
                        },
                        error: (err) => {
                            console.log('err-->', err);
                        },
                    });
                } else {
                    this.amaFlightOrderService.deleteAmadeusFlightOrder({
                        id: data.id,
                        amadeusOrderId: data.order.id,
                    } as OrderIDS)
                    .subscribe({
                        next: (res) => {
                            this.getFlightOrders();
                            console.log('d-->', res);
                        },
                        error: (err) => {
                            console.log('err-->', err);
                        },
                    });
                }
            }
        });
    }
}
