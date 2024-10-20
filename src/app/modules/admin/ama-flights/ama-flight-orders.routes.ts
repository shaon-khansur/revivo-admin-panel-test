import { Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrderListComponent } from '../deals/order-list/order-list.component';
import { DealOfficePaymentComponent } from '../deals/deal-office-payment/deal-office-payment/deal-office-payment.component';
import { OfficeInfoComponent } from '../office-info/office-info/office-info.component';

export default [
    { path: 'ama-flight-order', component: OrdersComponent },
    { path: 'deal-order', component: OrderListComponent },
    { path: 'deal-office-payment', component: DealOfficePaymentComponent },
    { path: 'office-info', component: OfficeInfoComponent },
] as Routes;
