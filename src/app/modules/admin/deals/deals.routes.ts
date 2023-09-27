import { Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { DestinationComponent } from './destination/destination.component';
import { DestinationListComponent } from './destination/destination-list/destination-list.component';
import { DestinationManageComponent } from './destination/destination-manage/destination-manage.component';

export default [
    { path: 'manage', component: ManageComponent },
    { path: 'destination-manage', component: DestinationManageComponent },
    { path: 'destination', component: DestinationComponent }
] as Routes;
