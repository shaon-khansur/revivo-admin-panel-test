import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddFareFamilyComponent } from '../add-fare-family/add-fare-family.component';
import { MatButtonModule } from '@angular/material/button';
import { FareFamilyServiceService } from '../service/fare-family-service.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-fare-family-details',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatTableModule, MatIconModule],
    templateUrl: './fare-family-details.component.html',
    styleUrls: ['./fare-family-details.component.scss'],
})
export class FareFamilyDetailsComponent implements OnInit {
    dataSource: any[];
    fareFamilyData: any[];
    displayedColumns: string[] = [
        'fareFeatureIcon',
        'fareFeatureTitle',
        'fareFeatureLabel',
        'fareFeatureIncluded',
    ];
    @ViewChild('featureTable') table!: MatTable<any[]>;
    constructor(
        private dialog: MatDialog,
        private fareFamilyService: FareFamilyServiceService,
        private _fuseConfirmationDialog: FuseConfirmationService
    ) {}
    ngOnInit(): void {
        this.fareFamilyService.getFareFamily().subscribe({
            next: (response) => {
                this.fareFamilyData = response;
                this.dataSource = this.fareFamilyData;
                this.dataSource.sort((a, b) => a.fareAmount - b.fareAmount)
            },
        });
    }
    edit(element) {
        console.log(element.id);

        this.dialog
            .open(AddFareFamilyComponent, {
                width: '800px',
                data: element,
            })
            .afterClosed()
            .subscribe((value) => {
                if (value) {
                    this.fareFamilyService
                        .updateFareFamily(value)
                        .subscribe((updatedFareFamily) => {
                            const index = this.dataSource.findIndex(
                                (c) => c.id === updatedFareFamily.id
                            );
                            console.log('index', value);

                            this.dataSource[index] = { ...updatedFareFamily };

                            if (this.table) {
                                this.table.renderRows();
                            }
                        });
                }
            });
    }
    add() {
        const dialogRef = this.dialog.open(AddFareFamilyComponent, {
            width: '800px',
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Data received from dialog:', result);
                this.fareFamilyService.addFareFamily(result).subscribe({
                    next: (fareFamily) => {
                        this.dataSource.push(fareFamily);

                        if (this.table) {
                            this.table.renderRows();
                        }
                    },
                });
            }
        });
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
                this.fareFamilyService.deleteFareFamily(data).subscribe({
                    next: (response: string) => {
                        console.log('Delete response:', response);

                        if (response === 'Doc deleted') {
                            const index = this.dataSource.findIndex(
                                (d) => d.id === data.id
                            );
                            console.log('index', index);
                            this.dataSource.splice(index, 1);

                            if (this.table) {
                                this.table.renderRows();
                            }
                        } else {
                            // Handle unexpected response
                            console.error('Unexpected response:', response);
                        }
                    },
                    error: (error) => {
                        console.error('Delete error:', error);
                        // Handle the error as needed (e.g., show an error message)
                    },
                });
            }
        });
    }
}
