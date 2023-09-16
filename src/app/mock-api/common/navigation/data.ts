/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // }

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
                link : '/dashboards/users',
            },
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
