import { Component, ViewChild } from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AirlineService } from 'app/modules/settings/service/airline/airline.service';
import { Observable, map, startWith, switchMap } from 'rxjs';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
    CommissionData,
    FlightCommissionService,
} from '../service/flight-commission.service';
import {
    MatTable,
    MatTableDataSource,
    MatTableModule,
} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddFlightCommissionComponent } from '../add-flight-commission/add-flight-commission.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DealcomissionComponent } from '../../deals/deal-settings/dealcomission/dealcomission.component';
import { FareFamilyDetailsComponent } from '../../fare-family/fare-family-details/fare-family-details.component';
import { DealMiningStatusComponent } from '../../deal-mining-status/deal-mining-status.component';
import { FareFamilyCommissionComponent } from '../fare-family-commission/fare-family-commission.component';

@Component({
    selector: 'app-flight-commision',
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
        DealcomissionComponent,
        FareFamilyDetailsComponent,
        DealMiningStatusComponent,
        FareFamilyCommissionComponent
    ],
    templateUrl: './flight-commision.component.html',
    styleUrls: ['./flight-commision.component.scss'],
})
export class FlightCommisionComponent {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'miningStatus';
    flightsCommissionsData: CommissionData[];

    displayedColumns: string[] = [
        'airline',
        'outboundCommission',
        'outboundAirport',
        'inboundCommission',
        'inboundAirport',
        'default',
        'provider',
        'view',
    ];
    dataSource: CommissionData[] = [];

    @ViewChild('commissionTable') table: MatTable<CommissionData[]>;

    constructor(
        private flightCommissionService: FlightCommissionService,
        private dialog: MatDialog,
        private _fuseConfirmationDialog:  FuseConfirmationService
    ) {}

    ngOnInit(): void {
        // Setup available panels
        this.flightCommissionService.getFlightsCommissions().subscribe({
            next: (response) => {
                this.flightsCommissionsData = response;
                this.dataSource = this.flightsCommissionsData;
            },
        });
        this.panels = [
            {
                id: 'commission',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Flight Commission',
                description: 'Manage your Flight commission',
            },
            {
                id: 'fare-family-commission',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Fare Family Commission',
                description: 'Manage your Fare family commission',
            },
            {
                id: 'dealCommission',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Deal Commission',
                description: 'Manage your Deal commission',
            },
            {
                id: 'fareFamily',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Alp Fare Family',
                description: 'Manage your Fare Family Options',
            },
            {
                id: 'miningStatus',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Alp Deal Mining Status',
                description: 'Monitoring your Deal Mining Status',
            },
        ];
    }

    edit(element) {
        console.log(element);
        this.dialog
            .open(AddFlightCommissionComponent, {
                width: '600px',
                data: element,
            })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    this.flightCommissionService
                        .updateCommssion(value)
                        .subscribe((updatedCommission) => {
                            const index = this.dataSource.findIndex(
                                (c) => c.id === updatedCommission.id
                            );

                            this.dataSource[index] = {
                                ...updatedCommission,
                            } as CommissionData;
                            this.table.renderRows();
                        });
                }
            });
    }

    add() {
        this.dialog
            .open(AddFlightCommissionComponent, { width: '600px' })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    console.log(value);
                    this.flightCommissionService
                        .addCommission(value)
                        .subscribe({
                            next: (flightCommission) => {
                                this.dataSource.push(flightCommission);
                                this.table.renderRows();
                            },
                        });
                }
            });
    }

    delete(data: CommissionData) {
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
                this.flightCommissionService.deleteCommission(data).subscribe({
                    next: deletedCommission => {
                        const index = this.dataSource.findIndex(d => d.id === deletedCommission.id);
                        this.dataSource.splice(index, 1);
                        this.table.renderRows();
                    }
                })

            }
        });
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
