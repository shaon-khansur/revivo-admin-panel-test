import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { adminGuard } from './core/auth/guards/admin.guard';
import { Error404Component } from './modules/error-404/error-404.component';
import { ExampleComponent } from './modules/admin/example/example.component';
import { SupportComponent } from './modules/supports/support/support.component';
import { SupportDashboardComponent } from './modules/supports/support-dashboard/support-dashboard.component';
import { supportDashboardGuard } from './core/auth/guards/support-dashboard.guard';
import { FareUpsellApiErroComponent } from './modules/supports/fare-upsell-api-erro/fare-upsell-api-erro.component';
import { CreateOrderErrorComponent } from './modules/supports/create-order-error/create-order-error.component';
import { AirportComponent } from './modules/settings/airport/airport.component';
import { AirlineComponent } from './modules/settings/airline/airline.component';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard/admin'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard/admin'},


    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboard', children: [
                {path: 'admin', component: ExampleComponent},
            ], canActivate: [adminGuard]},

            {path: 'user-management', children: [
                {path: 'users', loadChildren: () => import('app/modules/admin/users/users.routes')},
            ], canActivate: [adminGuard]},

            {path: 'dashboard', children: [
                {path: 'support', component: SupportDashboardComponent}

            ], canActivate: [supportDashboardGuard]},

            {path: 'data-management', loadChildren: () => import('app/modules/admin/flights/flights.routes')},

            {path: 'deals', loadChildren: () => import('app/modules/admin/deals/deals.routes')},
            {path: 'deals/destinations', loadChildren: () => import('app/modules/admin/deals/destination/destination.routes')},

            {path: 'supports', children: [
                {path: 'support', component: SupportComponent},
                {path: 'fare-upsell-api-error',component: FareUpsellApiErroComponent },
                {path: 'create-order-error',component: CreateOrderErrorComponent }

            ]},
            {path: 'utility', children: [
                {path: 'settings', loadChildren: () => import('app/modules/settings/settings.routes')},
                {path: 'airport', component: AirportComponent, canActivate: [adminGuard]},
                {path: 'airline', component: AirlineComponent, canActivate: [adminGuard]},
            ]},




            {path: "**", component: Error404Component},

        ]
    }
];
