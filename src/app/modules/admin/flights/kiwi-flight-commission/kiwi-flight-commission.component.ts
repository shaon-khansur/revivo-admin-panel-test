import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatTable,
    MatTableDataSource,
    MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddKiwiFlightCommissionComponent } from '../add-kiwi-flight-commission/add-kiwi-flight-commission.component';
import { FlightCommissionService } from '../service/flight-commission.service';

export interface KiwiCommissionData {
    id: string;
    airline: string;
    outboundAirport: string;
    outboundCommission: number;
    inboundAirport: string;
    inboundCommission: number;
    provider: string;
    default: boolean;
}

@Component({
    selector: 'app-kiwi-flight-commission',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTableModule,
    ],
    templateUrl: './kiwi-flight-commission.component.html',
    styleUrls: ['./kiwi-flight-commission.component.scss'],
})
export class KiwiFlightCommissionComponent implements OnInit {
    displayedColumns: string[] = [
        'airline',
        'outboundCommission',
        'outboundAirport',
        'inboundCommission',
        'inboundAirport',
        'default',
        'view',
    ];
    dataSource: KiwiCommissionData[] = [];
    kiwiCommissionsData: KiwiCommissionData[];
    @ViewChild('commissionTable') table: MatTable<KiwiCommissionData[]>;
    constructor(
        private flightCommissionService: FlightCommissionService,
        private dialog: MatDialog,
        private _fuseConfirmationDialog: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.flightCommissionService
            .getKiwiFlightsCommissions()
            .subscribe((kiwiCommissions) => {
                this.kiwiCommissionsData = kiwiCommissions;
                this.dataSource = kiwiCommissions;
            });
    }

    edit(element) {
        console.log(element);
        this.dialog
            .open(AddKiwiFlightCommissionComponent, {
                width: '600px',
                data: element,
            })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    this.flightCommissionService
                        .updateKiwiCommssion(value)
                        .subscribe((updatedCommission) => {
                            const index = this.dataSource.findIndex(
                                (c) => c.id === updatedCommission.id
                            );

                            this.dataSource[index] = {
                                ...updatedCommission,
                            } as KiwiCommissionData;
                            this.table.renderRows();
                        });
                }
            });
    }

    add() {
        this.dialog
            .open(AddKiwiFlightCommissionComponent, { width: '600px' })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    console.log(value);
                    this.flightCommissionService
                        .addKiwiCommission(value)
                        .subscribe({
                            next: (flightCommission) => {
                                this.dataSource.push(flightCommission);
                                this.table.renderRows();
                            },
                        });
                }
            });
    }

    delete(data: KiwiCommissionData) {
        // Open the confirmation dialog
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
                this.flightCommissionService.deleteKiwiCommission(data).subscribe({
                    next: (deletedCommission) => {
                        const index = this.dataSource.findIndex(
                            (d) => d.id === deletedCommission.id
                        );
                        this.dataSource.splice(index, 1);
                        this.table.renderRows();
                    },
                });
            }
        });
    }
}
