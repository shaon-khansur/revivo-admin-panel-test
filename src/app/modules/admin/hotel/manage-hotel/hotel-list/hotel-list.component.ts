import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HotelService } from '../../hotel.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { HotelDetailsComponent } from '../hotel-details/hotel-details.component';

@Component({
    selector: 'app-hotel-list',
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
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit {
    hotelList: any;
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        'Thumbnail',
        'cityName',
        'cityCode',
        'view'
    ];

    allAirlines: any[] = [];

    page: number = 1;
    resultsLength: number = 1;

    searchInputControl = new FormControl('');
    constructor(
        private hotelService: HotelService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.hotelService
            .getAllHotels({ page: this.page, hotelName: '' })
            .subscribe({
                next: (response) => {
                    this.allAirlines = response.allData;
                    this.dataSource = new MatTableDataSource(this.allAirlines);
                    this.resultsLength = response.metadata.totalItems;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.hotelService
                    .getAllHotels({
                        page: 1,
                        hotelName: value?.toLowerCase(),
                    })
                    .subscribe({
                        next: (response) => {
                            this.allAirlines = response.allData;
                            this.dataSource = new MatTableDataSource(
                                this.allAirlines
                            );
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
        this.hotelService
            .getAllHotels({ page: event.pageIndex, hotelName: '' })
            .subscribe({
                next: (response) => {
                    this.allAirlines = response.allData;
                    this.dataSource = new MatTableDataSource(this.allAirlines);
                    this.resultsLength = response.metadata.totalItems;
                },
            });
    }

    openDialog(airport): void {
        const config = new MatDialogConfig();
        config.width = '600px';
        config.data = airport;
        this.dialog
            .open(HotelDetailsComponent, config)
            .afterClosed()
            .subscribe((values) => {
                if (values) {
                    this.hotelService
                        .updateAirline({ id: airport.id, value: values })
                        .subscribe({
                            next: (res) => {
                                const index = this.allAirlines.findIndex(
                                    (el) => el.id === res.updatedAirline.id
                                );
                                this.allAirlines[index] = res.updatedAirline;
                                this.dataSource = new MatTableDataSource(
                                    this.allAirlines
                                );
                            },
                        });
                }
            });
    }
}
