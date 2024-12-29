import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateOrderErrorService } from './create-order-error.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-create-order-error',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule
    ],
    templateUrl: './create-order-error.component.html',
    styleUrls: ['./create-order-error.component.scss'],
})
export class CreateOrderErrorComponent implements OnInit {

    createOrderErrorService = inject(CreateOrderErrorService);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(private matDialog: MatDialog) {}

    displayedColumns: string[] = ['date', 'error', 'status', 'view'];
    creaOrderErrorData: any[] = [];
    dataSource: MatTableDataSource<any[]>;
    totalItems: number = 0; // Total number of items from the API
    limit: number = 10; // Number of items per page
    page: number = 0; // Current page index

    ngOnInit(): void {
        this.getCreateOrderErrorData({ page: this.page, limit: this.limit });
    }

    getCreateOrderErrorData(data: {page: number, limit: number}): void {
        this.createOrderErrorService.getFareUpsellErrorsData({ page: data.page, limit: data.limit }).subscribe({
            next: (res) => {
                this.creaOrderErrorData = res?.data;
                this.dataSource = new MatTableDataSource<any[]>(
                    this.creaOrderErrorData
                );
                this.totalItems = res.totalItems;
            },
            error: (err) => {
                console.log('fareupsellErrorData erro', err);
            },
        });
    }

    ngAfterViewInit() {
        this.paginator.page.subscribe((event) => {
            this.page = event.pageIndex;
            this.limit = event.pageSize;
            this.getCreateOrderErrorData({
                page: this.page,
                limit: this.limit,
            });
        });
    }

    public convertTimestampToDate(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toISOString();
    }

    view(rowData): void {
        this.matDialog.open(ErrorDialogComponent, { data: rowData });
    }

    getApiErrorMessafe(error): string {
        return error.data.errors[0].title;
    }
}
