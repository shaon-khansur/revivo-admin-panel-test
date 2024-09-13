import { Routes } from '@angular/router';
import { HotelListComponent } from './manage-hotel/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './manage-hotel/hotel-details/hotel-details.component';
import { KosherListComponent } from './manage-hotel/kosher-list/kosher-list.component';
import { KosherHotelDetailsComponent } from './manage-hotel/kosher-hotel-details/kosher-hotel-details.component';

export default [
    {
        path: 'hotel-list',
        component: HotelListComponent,
    },
    {
        path: 'kosher-hotel-list',
        component: KosherListComponent,
    },
    {
        path: 'hotel-details/:id',
        component: HotelDetailsComponent,
    },
    {
        path: 'kosher-hotel-details/:id',
        component: KosherHotelDetailsComponent,
    },
] as Routes;
