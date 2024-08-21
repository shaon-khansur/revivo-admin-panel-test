import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

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
    displayedColumns: string[] = [
        'Thumbnail',
        'hotelName',
        'cityName',
        'cityCode',
        'view',
    ];

    allHotel: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;

    searchInputControl = new FormControl('');
    constructor(
        private hotelService: HotelService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.hotelService
            .getAllHotels({
                page: this.page,
                hotelName: '',
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allHotel = response.allData;
                    this.dataSource = new MatTableDataSource(this.allHotel);
                    this.resultsLength = response.metadata.totalItems;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.hotelService
                    .getAllHotels({
                        page: 1, // Reset to page 1 when a search is performed
                        hotelName: value?.toLowerCase(),
                        pageSize: this.pageSize,
                    })
                    .subscribe({
                        next: (response) => {
                            this.allHotel = response.allData;
                            this.dataSource = new MatTableDataSource(
                                this.allHotel
                            );
                            this.resultsLength = response.metadata.totalItems;
                            this.paginator.firstPage(); // Reset paginator to the first page
                        },
                    });
            });
    }

    ngAfterViewInit(): void {
        this.paginator.pageIndex = 0; // Angular Material paginator starts at 0
        this.resultsLength = 0;
        this.cdr.detectChanges();
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1; // Add 1 to align with 1-based indexing
        this.pageSize = event.pageSize;

        this.hotelService
            .getAllHotels({
                page: this.page,
                hotelName: this.searchInputControl.value?.toLowerCase() || '',
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allHotel = response.allData;
                    this.dataSource = new MatTableDataSource(this.allHotel);
                    this.resultsLength = response.metadata.totalItems;
                },
            });
    }

    openDialog(hotel): void {
        const config = new MatDialogConfig();
        config.width = '600px';
        config.data = hotel;
        this.dialog
            .open(HotelDetailsComponent, config)
            .afterClosed()
            .subscribe((values) => {
                if (values) {
                    this.hotelService
                        .updateHotel({ id: hotel.id, value: values })
                        .subscribe({
                            next: (res) => {
                                const index = this.allHotel.findIndex(
                                    (el) => el.id === res.updatedAirline.id
                                );
                                
                                this.allHotel[index] = res.updatedAirline;
                                this.dataSource = new MatTableDataSource(
                                    this.allHotel
                                );
                            },
                        });
                }
            });
    }
}
