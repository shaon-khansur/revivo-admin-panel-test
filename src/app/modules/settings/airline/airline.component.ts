import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AirlineService } from '../service/airline/airline.service';
import { AirlineDialogComponent } from './airline-dialog/airline-dialog.component';
import { MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-airline',
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
    templateUrl: './airline.component.html',
    styleUrls: ['./airline.component.scss'],
})
export class AirlineComponent {
    displayedColumns: string[] = [
        'name',
        'code',
        'logo',
        'view'
    ];
    dataSource: MatTableDataSource<any[]>;
    allAirlines: any[] = [];

    page: number = 1;
    resultsLength: number = 1;

    searchInputControl = new FormControl('');

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private airlineService: AirlineService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.airlineService
            .getAirlines({ page: this.page, name:"", code:"" })
            .subscribe({
                next: (response) => {
                    this.allAirlines = response.airlines;
                    this.dataSource = new MatTableDataSource(this.allAirlines);
                    this.resultsLength = response.metadata.totalItems;
                    // this.dataSource.sort = this.sort;
                    // this.dataSource.paginator = this.paginator;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.airlineService
                    .getAirlines({
                        page: 1,
                        name: value?.toLowerCase(),
                        code: ""
                    })
                    .subscribe({
                        next: (response) => {
                            this.allAirlines = response.airlines;
                            this.dataSource = new MatTableDataSource(this.allAirlines);
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
        this.airlineService
            .getAirlines({ page: event.pageIndex, name: "", code: "" })
            .subscribe({
                next: (response) => {
                    this.allAirlines = response.airlines;
                    this.dataSource = new MatTableDataSource(this.allAirlines);
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
        this.dialog.open(AirlineDialogComponent, config).afterClosed().subscribe(values => {
            if (values) {
                this.airlineService.updateAirline({id: airport.id, value: values}).subscribe({
                    next: (res) => {
                        const index = this.allAirlines.findIndex(el => el.id === res.updatedAirline.id);
                        this.allAirlines[index] = res.updatedAirline;
                        this.dataSource = new MatTableDataSource(this.allAirlines);
                    }
                })
            }
        })
    }
}
