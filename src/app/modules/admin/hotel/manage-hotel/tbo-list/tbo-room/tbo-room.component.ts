import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { HotelService } from 'app/modules/admin/hotel/hotel.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UpdateComponent } from 'app/modules/admin/flights/supplier/supplier-list/supplierUpdate/update/update.component';
import { SupplierService } from 'app/modules/admin/flights/supplier/supplier.service';
import { UpdateRoomComponent } from './update-room/update-room.component';
// import { UpdateComponent } from './supplierUpdate/update/update.component';

@Component({
    selector: 'app-tbo-room',
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
    ],
    templateUrl: './tbo-room.component.html',
    styleUrls: ['./tbo-room.component.scss'],
})
export class TboRoomComponent {
    hotelList: any;
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['roomName', 'roomType', 'bedType', 'update'];

    allsupplier: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;

    searchInputControl = new FormControl('');
    constructor(
        private hotelService: HotelService,
        private dialog: MatDialog,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.hotelService
            .getRoomData({
                page: this.page,
                roomNameSearch: '',
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.allsupplier = response.allData;
                    this.dataSource = new MatTableDataSource(this.allsupplier);
                    this.resultsLength = response.metadata?.totalItems;
                },
            });

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.hotelService
                    .getRoomData({
                        page: 1, // Reset to page 1 when a search is performed
                        roomNameSearch: value?.toLowerCase(),
                        pageSize: this.pageSize,
                    })
                    .subscribe({
                        next: (response) => {
                            this.allsupplier = response.allData;
                            this.dataSource = new MatTableDataSource(
                                this.allsupplier
                            );
                            this.resultsLength = response.metadata.totalItems;
                            this.paginator.firstPage(); // Reset paginator to the first page
                        },
                    });
            });
    }

    ngAfterViewInit(): void {
        this.paginator.pageIndex = 0;
        this.resultsLength = 0;
        this.cdr.detectChanges();
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1; // Add 1 to align with 1-based indexing
        this.pageSize = event.pageSize;

        this.hotelService
            .getRoomData({
                page: this.page,
                roomNameSearch:
                    this.searchInputControl.value?.toLowerCase() || '',
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allsupplier = response.allData;
                    this.dataSource = new MatTableDataSource(this.allsupplier);
                    this.resultsLength = response.metadata.totalItems;
                },
            });
    }

    openDialog(data): void {
        console.log('supplier', data);

        const dialogRef = this.dialog.open(UpdateRoomComponent, {
            width: '600px',
            data: data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save') {
                this.updateSupplier(result.data, data.id);
            }
        });
    }

    updateSupplier(data: any, id: string): void {
        console.log('update', data);

        const payload = {
            ...data,
            id,
        };

        this.hotelService.updateRoom(payload).subscribe({
            next: (response) => {
                this.refreshSupplierList();
            },
            error: (error) => {
                console.error('Error updating supplier:', error);
            },
        });
    }

    refreshSupplierList(): void {
        this.hotelService
            .getRoomData({
                page: this.page,
                roomNameSearch:
                    this.searchInputControl.value?.toLowerCase() || '',
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allsupplier = response.allData;
                    this.dataSource = new MatTableDataSource(this.allsupplier);
                    this.resultsLength = response.metadata.totalItems;
                    this.paginator.firstPage(); // Optional: Reset paginator to the first page
                },
                error: (error) => {
                    console.error('Error fetching hotel list:', error);
                },
            });
    }
}
