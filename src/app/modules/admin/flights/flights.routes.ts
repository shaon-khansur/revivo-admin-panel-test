import { Routes } from '@angular/router';
import { FlightCommisionComponent } from './flight-commision/flight-commision.component';
import { UploadComponent } from '../revivo-updates/upload/upload.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';

export default [
    { path: 'site-settings', component: FlightCommisionComponent },
    { path: 'revivo-update', component: UploadComponent },
    { path: 'supplier', component: SupplierListComponent },
] as Routes;
