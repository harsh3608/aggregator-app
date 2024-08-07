import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const commonGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //const role = authService.getLoggedInUserDetails().UserType;
  // if (authService.isLoggedIn() && role == 'Admin' || role == 'User') {

  //temp code
    if (authService.isLoggedIn() ) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  };
};
