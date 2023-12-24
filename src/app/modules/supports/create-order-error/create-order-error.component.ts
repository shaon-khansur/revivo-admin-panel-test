import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CreateOrderErrorService } from './create-order-error.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

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
    ],
    templateUrl: './create-order-error.component.html',
    styleUrls: ['./create-order-error.component.scss'],
})
export class CreateOrderErrorComponent implements OnInit {

    createOrderErrorService = inject(CreateOrderErrorService);
    constructor(private matDialog: MatDialog) {}

    displayedColumns: string[] = ['date', 'error', 'status', 'view'];
    dataSource: any[] = [];

    ngOnInit(): void {
        this.createOrderErrorService.getFareUpsellErrorsData().subscribe({
            next: (res) => {
                this.dataSource = res.sort(
                    (a, b) =>
                        new Date(b.timeStamp).getTime() -
                        new Date(a.timeStamp).getTime()
                );
                console.log('fa', res)
            },
            error: (err) => {
                console.log('fareupsellErrorData erro', err);
            },
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
