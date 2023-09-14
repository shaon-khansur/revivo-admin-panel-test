import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { inject } from '@angular/core';
import { UsersService } from './users.service';
import { catchError, throwError } from 'rxjs';

const userResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const contactsService = inject(UsersService);
    const router = inject(Router);

    return contactsService.getUserById(route.paramMap.get('id')).pipe(
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
    component: UserDetailsComponent,
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
    if (!nextState.url.includes('/users')) {
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
        component: UsersComponent,

        children: [
            {
                path: '',
                component: UserListComponent,
                resolve: {
                    usersList: () => inject(UsersService).getAllUser(),
                },
                children: [
                    {
                        path: ':id',
                        component: UserDetailsComponent,
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
