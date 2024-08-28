import { Routes } from '@angular/router';
import { HotelListComponent } from './manage-hotel/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './manage-hotel/hotel-details/hotel-details.component';

export default [
    {
        path: 'hotel-list',
        component: HotelListComponent,
    },
    {
        path: ':id',
        component: HotelDetailsComponent,
    },
] as Routes;
