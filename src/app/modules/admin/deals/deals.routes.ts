import { Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { DestinationComponent } from './destination/destination.component';

export default [
    { path: 'manage', component: ManageComponent },
    { path: 'destination', component: DestinationComponent },
] as Routes;
