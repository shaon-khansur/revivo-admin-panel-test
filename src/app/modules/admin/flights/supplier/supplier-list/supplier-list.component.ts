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
import { SupplierService } from '../supplier.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UpdateComponent } from './supplierUpdate/update/update.component';

@Component({
    selector: 'app-supplier-list',
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
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent {
    hotelList: any;
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['name', 'code', 'update', 'delete'];

    allsupplier: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;

    searchInputControl = new FormControl('');
    constructor(
        private supplierService: SupplierService,
        private dialog: MatDialog,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.supplierService
            .getAllSupplier({
                page: this.page,
                name: '',
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
                this.supplierService
                    .getAllSupplier({
                        page: 1, // Reset to page 1 when a search is performed
                        name: value?.toLowerCase(),
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

        this.supplierService
            .getAllSupplier({
                page: this.page,
                name: this.searchInputControl.value?.toLowerCase() || '',
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

    openDialog(supplier): void {
        const dialogRef = this.dialog.open(UpdateComponent, {
            width: '400px', 
            data: supplier, 
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result?.action === 'save') {
                this.updateSupplier(result.data, supplier.id);
            }
        });
    }

    updateSupplier(updatedSupplier, id): void {
      console.log("update", updatedSupplier);
      
        this.supplierService.updateSupplier(updatedSupplier, id).subscribe({
            next: (response) => {
                // After the update is successful, refresh the list
                this.refreshSupplierList();
            },
            error: (error) => {
                console.error('Error updating supplier:', error);
            },
        });
    }

    deleteSupplier(supplierId: string): void {
        console.log(supplierId);

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Supplier',
            message:
                'Are you sure you want to delete this Supplier? This action cannot be undone!',
            actions: {
                confirm: {
                    show: true,
                    label: 'Ok',
                    color: 'primary',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            console.log(result);

            if (result === 'confirmed') {
                this.supplierService.deleteSupplierById(supplierId).subscribe({
                    next: () => {
                        this.refreshSupplierList();
                    },
                    error: (error) => {
                        console.error('Error deleting supplier:', error);
                    },
                });
            }
        });
    }

    refreshSupplierList(): void {
        this.supplierService
            .getAllSupplier({
                page: this.page,
                name: this.searchInputControl.value?.toLowerCase() || '',
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
