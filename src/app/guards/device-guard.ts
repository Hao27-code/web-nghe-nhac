import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const mobileOnlyGuard: CanMatchFn = () => {
  const router = inject(Router);
  const isDesktop = window.innerWidth >= 992;

  return isDesktop ? router.parseUrl('/home') : true;
};
export const desktopOnlyGuard: CanMatchFn = () => {
  const router = inject(Router);
  const isDesktop = window.innerWidth >= 992;

  return isDesktop ? true : router.parseUrl('/tabs/home');
};

