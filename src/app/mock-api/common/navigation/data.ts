/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboard.admin',
        title   : 'Dashboard',
        subtitle: 'Admin Dashboard',
        type    : 'basic',
        icon    : 'heroicons_outline:chart-pie',
        link    : '/dashboard/admin'

    },

    {
        id      : 'dashboard.support',
        title   : 'Dashboard',
        subtitle: 'Support Dashboard',
        type    : 'basic',
        icon    : 'heroicons_outline:chart-pie',
        link    : '/dashboard/support'

    },

    {
        id      : 'user-management',
        title   : 'User Managements',
        subtitle: 'Manage your system users',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'user-management.users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/user-management/users',
            },
        ],
    },
    {
        id      : 'ama-flight-order-management',
        title   : 'Amadeus Flight Order Managements',
        subtitle: 'Manage your amadeus flight orders',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'ama-flight-order-management.orders',
                title: 'Amadeus Flight Orders',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/ama-flight-order/orders',
            },
        ],
    },
    {
        id: 'site-settings',
        title: 'Data Managements',
        subtitle: 'Manage your site settings',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id   : 'site-settings.flightCommission',
                title: 'Site Settings',
                type : 'basic',
                icon : 'heroicons_outline:fire',
                link : '/data-management/site-settings',
            },
            {
                id   : 'site-settings.flightCommission',
                title: 'Revivo Updates',
                type : 'basic',
                icon : 'heroicons_outline:arrow-path',
                link : '/data-management/revivo-update',
            },
        ]
    },
    {
        id      : 'deals',
        title   : 'Deals',
        subtitle: 'Manage Deals',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'deals.manage',
                title: 'Manage Deals',
                type : 'basic',
                icon : 'heroicons_outline:fire',
                link : '/deals/manage',
            },
            {
                id   : 'deals.deal-order',
                title: 'Deal Order List',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/deals/deal-order',
            },
            {
                id   : 'deals.destination-manage',
                title: 'Manage Destination',
                type : 'basic',
                icon : 'heroicons_outline:building-office',
                link : '/deals/destination-manage',
            },
            {
                id   : 'deals.destinations',
                title: 'Destination List',
                type : 'basic',
                icon : 'heroicons_outline:building-office',
                link : '/deals/destinations',
            }

        ],
    },
    {
        id      : 'supports',
        title   : 'Supports',
        subtitle: 'System support',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'support.support',
                title: 'Support',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/supports/support',
            },
            {
                id   : 'support.fare',
                title: 'Fare upsell API Error',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/supports/fare-upsell-api-error',
            },
            {
                id   : 'support.order',
                title: 'Create order API Error',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/supports/create-order-error',
            },
        ],
    },
    {
        id      : 'utility',
        title   : 'Utility',
        subtitle: 'System utility',
        type    : 'group',
        icon    : 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id   : 'utility.settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/utility/settings',
            },
            {
                id   : 'utility.airport',
                title: 'Airport setting',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/utility/airport',
            },
            {
                id   : 'utility.airline',
                title: 'Airline setting',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/utility/airline',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
