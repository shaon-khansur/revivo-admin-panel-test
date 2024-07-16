import { Routes } from '@angular/router';
import { FlightCommisionComponent } from './flight-commision/flight-commision.component';
import { UploadComponent } from '../revivo-updates/upload/upload.component';

export default [
    { path: 'site-settings', component: FlightCommisionComponent },
    { path: 'revivo-update', component: UploadComponent },
] as Routes;
