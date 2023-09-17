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
