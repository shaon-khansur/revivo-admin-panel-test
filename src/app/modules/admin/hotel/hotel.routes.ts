import { Routes } from '@angular/router';
import { HotelListComponent } from './manage-hotel/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './manage-hotel/hotel-details/hotel-details.component';
import { KosherListComponent } from './manage-hotel/kosher-list/kosher-list.component';
import { KosherHotelDetailsComponent } from './manage-hotel/kosher-hotel-details/kosher-hotel-details.component';
import { AddHotelComponent } from './manage-hotel/add-hotel/add-hotel.component';
import { TboHotelListComponent } from './manage-hotel/tbo-list/tbo-hotel-list/tbo-hotel-list.component';

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
        path: 'tbo-hotel-list',
        component: TboHotelListComponent,
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
