import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AirportService } from '../service/airport/airport.service';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { AirportDialogComponent } from './airport-dialog/airport-dialog.component';
@Component({
    selector: 'app-airport',
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
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
    ],
    templateUrl: './airport.component.html',
    styleUrls: ['./airport.component.scss'],
})
export class AirportComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'name',
        'iata',
        'country',
        'city',
        'cityHibrew',
        'state',
        'view',
    ];
    dataSource: MatTableDataSource<any[]>;
    allAirports: any[] = [];

    page: number = 1;
    resultsLength: number = 1;

    searchInputControl = new FormControl('');

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private airportService: AirportService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.airportService
            .getAirports({ page: this.page, value: '' })
            .subscribe({
                next: (response) => {
                    this.allAirports = response.airports;
                    this.dataSource = new MatTableDataSource(this.allAirports);
                    this.resultsLength = response.metadata.totalItems;
                    // this.dataSource.sort = this.sort;
                    // this.dataSource.paginator = this.paginator;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.airportService
                    .getAirports({
                        page: this.page,
                        value: value.toLowerCase(),
                    })
                    .subscribe({
                        next: (response) => {
                            this.allAirports = response.airports;
                            this.dataSource = new MatTableDataSource(this.allAirports);
                            this.resultsLength = response.metadata.totalItems;
                            // this.dataSource.sort = this.sort;
                            // this.dataSource.paginator = this.paginator;
                        },
                    });
            });
    }

    ngAfterViewInit(): void {
        this.paginator.pageIndex = 1;
        this.resultsLength = 1;
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex;
        // console.log('page event', event);
        this.airportService
            .getAirports({ page: event.pageIndex, value: '' })
            .subscribe({
                next: (response) => {
                    this.allAirports = response.airports;
                    this.dataSource = new MatTableDataSource(this.allAirports);
                    this.resultsLength = response.metadata.totalItems;
                    // this.dataSource.sort = this.sort;
                    // this.dataSource.paginator = this.paginator;
                    // console.log(response.airports);
                    // console.log('page event', {
                    //     event,
                    //     paginator: {
                    //         length: this.paginator.length,
                    //         pageIndex: this.paginator.pageIndex,
                    //         pageSize: this.paginator.pageSize,
                    //     },
                    // });
                },
            });
    }

    openDialog(airport): void {
        const config = new MatDialogConfig();
        config.width = "600px"
        config.data = airport;
        this.dialog.open(AirportDialogComponent, config).afterClosed().subscribe(values => {
            if (values) {
                this.airportService.updateAirport({id: airport.id, value: values}).subscribe({
                    next: (res) => {
                        const index = this.allAirports.findIndex(el => el.id === res.updatedAirport.id);
                        this.allAirports[index] = res.updatedAirport;
                        this.dataSource = new MatTableDataSource(this.allAirports);
                    }
                })
            }
        })
    }
}
