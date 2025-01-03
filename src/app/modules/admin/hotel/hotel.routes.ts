import { Routes } from '@angular/router';
import { HotelListComponent } from './manage-hotel/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './manage-hotel/hotel-details/hotel-details.component';
import { KosherListComponent } from './manage-hotel/kosher-list/kosher-list.component';
import { KosherHotelDetailsComponent } from './manage-hotel/kosher-hotel-details/kosher-hotel-details.component';
import { AddHotelComponent } from './manage-hotel/add-hotel/add-hotel.component';

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
        component: AddHotelComponent,
    },
    {
        path: 'kosher-hotel-details/:id',
        component: AddHotelComponent,
    },
    {
        path: 'add-hotel',
        component: AddHotelComponent,
    },
] as Routes;
