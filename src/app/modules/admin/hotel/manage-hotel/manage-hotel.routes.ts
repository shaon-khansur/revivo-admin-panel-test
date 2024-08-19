import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HotelComponent } from './hotel.component';
import { HotelService } from '../hotel.service';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';

const hotelResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const hotelService = inject(HotelService);
    const router = inject(Router);

    const hotelId = route.paramMap.get('hotelID'); // Ensure this matches the route parameter
    console.log(hotelId);

    if (!hotelId) {
        router.navigateByUrl('/'); // Redirect if no hotelId is found
        return throwError(() => new Error('Hotel ID not provided'));
    }

    return hotelService.getHotelById(hotelId).pipe(
        catchError((error) => {
            console.error('Error fetching hotel data:', error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );
};

const canDeactivateHotelDetails = (
    component: HotelDetailsComponent,
    nextState: RouterStateSnapshot
) => {
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // Ensure URL and parameter checks are correct
    if (!nextState.url.includes('/hotel-list')) {
        return true;
    }

    if (nextRoute.paramMap.has('hotelID')) {
        return true;
    }

    // Assuming closeDrawer returns a Promise<void>
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: HotelComponent,
        children: [
            {
                path: '',
                component: HotelListComponent,
                resolve: {
                    hotelsList: () => inject(HotelService).getAllHotels(),
                },
                children: [
                    {
                        path: ':hotelID',
                        component: HotelDetailsComponent,
                        resolve: {
                            hotel: hotelResolver,
                        },
                        canDeactivate: [canDeactivateHotelDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
