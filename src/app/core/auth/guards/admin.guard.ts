import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of, switchMap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

    return inject(AuthService).systemUser$.pipe(
        switchMap((user) => {
            if (user.role.role === 'admin') {
                return of(true);
            } else {
                inject(Router).navigate(['/'])
                alert('Protected route');
                return of(false);
            }
        })
    );
};
