import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { AuthUtils } from '../auth.utils';

export const adminGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    const router = inject(Router);
    const token = localStorage.getItem('accessToken');
    const decodedToken: { role: string } = AuthUtils._decodeToken(token);

    if (decodedToken.role === 'admin') {
        // router.navigate(['/dashboard/admin']);
        return true
    } else if (decodedToken.role === 'support_and_billing') {
        router.navigate(['/dashboard/support'])
    } else {
        router.navigate(['/supports']);
    }
};
