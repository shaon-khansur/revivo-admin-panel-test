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
import { UpdateRoomComponent } from 'app/modules/admin/hotel/manage-hotel/tbo-list/tbo-room/update-room/update-room.component';
import { OpenMemoryServiceService } from './open-memory-service.service';

@Component({
    selector: 'app-open-memory',
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
    templateUrl: './open-memory.component.html',
    styleUrls: ['./open-memory.component.scss'],
})
export class OpenMemoryComponent {
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [
        'conversationId',
        'totalChat',
        'edit',
        'delete',
    ];

    allMemory: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;
    constructor(
        private memoryService: OpenMemoryServiceService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.memoryService
            .getMemoryData({
                page: this.page,
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.allMemory = response.conversations;
                    this.dataSource = new MatTableDataSource(this.allMemory);
                    this.resultsLength = response.metadata?.totalItems;
                },
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

        this.memoryService
            .getMemoryData({
                page: this.page,
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    this.allMemory = response.conversations;
                    this.dataSource = new MatTableDataSource(this.allMemory);
                    this.resultsLength = response.metadata.totalItems;
                },
            });
    }

    openDialog(data): void {
        console.log('supplier', data);
        this.router.navigate(['supports/openMemory', data.conversations_id]);
    }

    delete(id) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
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
                this.memoryService.deleteMemory(id).subscribe({
                    next: (response) => {
                        this.refreshSupplierList();
                    },
                });
            }
        });
    }

    deleteAllMemory() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete data',
            message:
                'Are you sure you want to delete ALL messages? This action cannot be undone!',
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
                this.memoryService.deleteAllMemory().subscribe({
                    next: () => {
                        this.refreshSupplierList();
                    },
                    error: (err) =>
                        console.error('Error deleting all messages:', err),
                });
            }
        });
    }

    refreshSupplierList(): void {
        this.memoryService
            .getMemoryData({
                page: this.page,
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    console.log('response', response);

                    this.allMemory = response.conversations;
                    this.dataSource = new MatTableDataSource(this.allMemory);
                    this.resultsLength = response.metadata.totalItems;
                    this.paginator.firstPage();
                },
                error: (error) => {
                    console.error('Error fetching hotel list:', error);
                },
            });
    }
}
