import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ManageComponent } from './../manage/manage.component';
import { DestinationComponent } from './../destination/destination.component';
import { DestinationListComponent } from './../destination/destination-list/destination-list.component';
import { DestinationManageComponent } from './../destination/destination-manage/destination-manage.component';
import { inject } from '@angular/core';
import { DestinationService } from './../destination/service/destination.service';
import { catchError, throwError } from 'rxjs';
import { DestinationDetailsComponent } from './../destination/destination-details/destination-details.component';

const userResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const destinationService = inject(DestinationService);
    const router = inject(Router);

    return destinationService.getUserById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

const canDeactivateContactsDetails = (
    component: DestinationDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/destinations')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: DestinationComponent,

        children: [
            {
                path: '',
                component: DestinationListComponent,
                resolve: {
                    usersList: () => inject(DestinationService).getAllDestination(),
                },
                children: [
                    {
                        path: ':id',
                        component: DestinationDetailsComponent,
                        resolve: {
                            contact: userResolver,
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;