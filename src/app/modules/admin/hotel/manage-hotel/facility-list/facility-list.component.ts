import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelService } from '../../hotel.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import {
    _MatSlideToggleRequiredValidatorModule,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UpdateFacilityComponent } from './update-facility/update-facility.component';

@Component({
    selector: 'app-facility-list',
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
        RouterModule,
        _MatSlideToggleRequiredValidatorModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatCheckboxModule,
    ],
    templateUrl: './facility-list.component.html',
    styleUrls: ['./facility-list.component.scss'],
})
export class FacilityListComponent implements OnInit {
    hotelList: any;
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
        'totalItems',
        'tag',
        'iconName',
        'view',
    ];

    allFacility: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;

    searchInputControl = new FormControl('');
    constructor(
        private hotelService: HotelService,
        private dialog: MatDialog,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.hotelService
            .getFacilityData({
                page: this.page,
                facilityName: '',
                perPage: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.allFacility = response.allData;
                    this.dataSource = new MatTableDataSource(this.allFacility);
                    this.resultsLength = response.metadata?.totalItems;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.hotelService
                    .getFacilityData({
                        page: 1, // Reset to page 1 when a search is performed
                        facilityName: value?.toLowerCase(),
                        perPage: this.pageSize,
                    })
                    .subscribe({
                        next: (response) => {
                            this.allFacility = response.allData;
                            this.dataSource = new MatTableDataSource(
                                this.allFacility
                            );
                            this.resultsLength = response.metadata.totalItems;
                            this.paginator.firstPage(); // Reset paginator to the first page
                        },
                    });
            });
    }

    onChange() {
        this.refreshHotelList();
    }
    openDialog(city: any): void {
        const dialogRef = this.dialog.open(UpdateFacilityComponent, {
            width: '600px',
            data: city,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save') {
                this.updateFacility(result.data);
            }
        });
    }
    updateFacility(updatedFacility: any): void {
        console.log('City data update in progress for:', updatedFacility);

        // Assuming you already have the `updateCityRequest` method defined:
        this.hotelService.updateFacility(updatedFacility).subscribe(
            (response) => {
                console.log('City data successfully updated:', response);
                this.refreshHotelList();
            },
            (error) => {
                console.error('Error updating city data:', error);
            }
        );
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
            .getFacilityData({
                page: this.page,
                facilityName: this.searchInputControl.value?.toLowerCase() || '',
                perPage: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allFacility = response.allData;
                    this.dataSource = new MatTableDataSource(this.allFacility);
                    this.resultsLength = response.metadata.totalItems;
                },
            });
    }
    refreshHotelList(): void {
        this.hotelService
            .getFacilityData({
                page: this.page,
                facilityName: this.searchInputControl.value?.toLowerCase() || '',
                perPage: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allFacility = response.allData;
                    this.dataSource = new MatTableDataSource(this.allFacility);
                    this.resultsLength = response.metadata.totalItems;
                    this.paginator.firstPage(); // Optional: Reset paginator to the first page
                },
                error: (error) => {
                    console.error('Error fetching hotel list:', error);
                },
            });
    }
}
