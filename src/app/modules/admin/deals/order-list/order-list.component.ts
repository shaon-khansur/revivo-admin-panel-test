import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListServiceService } from './order-list-service.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule, CommonModule, MatButtonModule],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
    orderDataList: any;
    displayedColumns: string[] = [
        'id',
        'customer',
        'packageName',
        'hotel',
        'rooms',
        'address',
        'amount',
        'action',
    ];
    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private orderData: OrderListServiceService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.orderData.getDealOrderData().subscribe(
            (response) => {
                this.orderDataList = response.sort((a, b) => {
                    const isStringA = typeof a.orderId === 'string' && a.orderId.startsWith('F');
                    const isStringB = typeof b.orderId === 'string' && b.orderId.startsWith('F');
    
                    if (isStringA && !isStringB) {
                        return -1;
                    } else if (!isStringA && isStringB) {
                        return 1; 
                    } else {
                        return 0;
                    }
                });
    
                this.dataSource.data = this.orderDataList;
                this.dataSource.paginator = this.paginator;
                console.log(response);
            },
            (error) => {
                console.error('Error fetching order data:', error);
            }
        );
    }
    
    
    openModal(element: any) {
        this.orderData.getDealOrderDataById(element.id).subscribe(data => {
            const dialogRef = this.dialog.open(OrderDetailsComponent, {
                width: '1000px',
                data: data
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed');
            });
        });
    }
    
}
