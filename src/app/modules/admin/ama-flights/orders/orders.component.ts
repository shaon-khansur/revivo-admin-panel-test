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
        this.amaFlightOrderService.getAllOrders().subscribe({
            next: (response) => {
                this.amaFlightOrderData = response.data;
                this.dataSource = this.amaFlightOrderData;
                console.log('amaFlightOrders', this.amaFlightOrderData);
            },
        });
    }

    getPnr(element) {
        if (element.order.associatedRecords.length > 1) {
            const sorted = element.order.associatedRecords
                .sort((a, b) => {
                    return a.flightOfferId - b.flightOfferId;
                })
                .map((el) => el.reference);
            return sorted;
        } else {
            const sorted = element.order.associatedRecords.map(
                (el) => el.reference
            );
            return sorted;
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
                this.amaFlightOrderService
                    .deleteAmadeusFlightOrder({
                        id: data.id,
                        amadeusOrderId: data.order.id,
                    } as OrderIDS)
                    .subscribe({
                        next: (res) => {
                            console.log('d-->', res);
                        },
                        error: (err) => {
                            console.log('err-->', err);
                        },
                    });
            }
        });
    }
}
