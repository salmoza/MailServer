import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthService} from './AuthService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthernticated()) {
    return true;
  } else {
    console.log("Access blocked. Redirecting to /login.");
    router.navigate(['/login']);
    return false;
  }
};
