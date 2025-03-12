import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlightCommissionService } from '../service/flight-commission.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FareFamilyCommissioinDialogComponent } from './fare-family-commissioin-dialog/fare-family-commissioin-dialog.component';


export interface FareFamilyCommissionData {
    id: string;
    type: string;
    amount: number;
}

@Component({
    selector: 'app-fare-family-commission',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTableModule,
    ],
    templateUrl: './fare-family-commission.component.html',
    styleUrls: ['./fare-family-commission.component.scss'],
})
export class FareFamilyCommissionComponent {
    displayedColumns: string[] = ['type', 'amount', 'view'];
    dataSource: FareFamilyCommissionData[] = [];
    fareFamilyCommissionsData: FareFamilyCommissionData[];

    @ViewChild('fareFamilyCommissionTable') table: MatTable<
        FareFamilyCommissionData[]
    >;

    constructor(
        private flightCommissionService: FlightCommissionService,
        private dialog: MatDialog,
        private _fuseConfirmationDialog: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        // Setup available panels
        this.flightCommissionService.getFareFamilyCommissions().subscribe({
            next: (response) => {
                this.fareFamilyCommissionsData = response;
                this.dataSource = this.fareFamilyCommissionsData;
            },
        });
    }


    edit(element) {
        console.log(element);
        this.dialog
            .open(FareFamilyCommissioinDialogComponent, {
                width: '600px',
                data: element,
            })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    this.flightCommissionService
                        .updateFareFamilyCommssion(value)
                        .subscribe((updatedCommission) => {
                            const index = this.dataSource.findIndex(
                                (c) => c.id === updatedCommission.id
                            );

                            this.dataSource[index] = {
                                ...updatedCommission,
                            } as FareFamilyCommissionData;
                            this.table.renderRows();
                        });
                }
            });
    }

    add() {
        this.dialog
            .open(FareFamilyCommissioinDialogComponent, { width: '600px' })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    console.log(value);
                    this.flightCommissionService
                        .addFareFamilyCommission(value)
                        .subscribe({
                            next: (flightCommission) => {
                                this.dataSource.push(flightCommission);
                                this.table.renderRows();
                            },
                        });
                }
            });
    }

    delete(data: FareFamilyCommissionData) {
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
                this.flightCommissionService
                    .deleteFareFamilyCommission(data)
                    .subscribe({
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
