import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { OrderDetailsComponent } from '../../order-list/order-details/order-details.component';
import { OrderListServiceService } from '../../order-list/order-list-service.service';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-deal-office-payment',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './deal-office-payment.component.html',
    styleUrls: ['./deal-office-payment.component.scss'],
})
export class DealOfficePaymentComponent implements OnInit {
    orderDataList: any;
    displayedColumns: string[] = [
        'id',
        'customer',
        'email',
        'package',
        'amount',
        'orderFrom',
        'action',
    ];
    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private orderData: OrderListServiceService,
        private dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit() {
        this.orderDatas();
    }

    orderDatas() {
        this.orderData.getDealOrderData().subscribe(
            (response) => {
                this.orderDataList = response
                    .filter((order) => order.payOptionType === 'Office')
                    .sort((a, b) => {
                        const isStringA =
                            typeof a.orderId === 'string' &&
                            a.orderId.startsWith('F');
                        const isStringB =
                            typeof b.orderId === 'string' &&
                            b.orderId.startsWith('F');

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
            },
            (error) => {
                console.error('Error fetching order data:', error);
            }
        );
    }

    openModal(element: any) {
        this.orderData.getDealOrderDataById(element.id).subscribe((data) => {
            const dialogRef = this.dialog.open(OrderDetailsComponent, {
                width: '1000px',
                data: data,
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log('The dialog was closed');
            });
        });
    }
    deleteOrder(id: any) {
      const confirmation = this._fuseConfirmationService.open({
          title: 'Delete order',
          message: 'Are you sure you want to cancel this order? This action cannot be undone!',
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
              // Call the delete API
              this.orderData.deleteDealOrderDataById(id).subscribe(() => {
                  // Show success message
                  const cancelConfirmation = this._fuseConfirmationService.open({
                      title: 'Order Canceled',
                      message: 'Successfully canceled order',
                      icon: {
                          show: true,
                          name: 'heroicons_outline:check',
                          color: 'warn',
                      },
                      actions: {
                          confirm: {
                              show: false,
                          },
                      },
                      dismissible: false,
                  });
  
                  // After the success confirmation dialog is closed
                  cancelConfirmation.afterClosed().subscribe(() => {
                      // Fetch the updated order data
                      this.orderDatas(); // This will refresh the data
  
                      // Reset paginator after fetching new data
                      this.dataSource.paginator = this.paginator;
                  });
              }, error => {
                  console.error('Error deleting order:', error);
              });
          }
      });
  }
  
  
}
