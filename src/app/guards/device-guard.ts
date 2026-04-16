import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const deviceGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isDesktop = window.innerWidth >= 992;
  const url = state.url; // ✅ URL thật đang đi tới

  // 📱 Mobile mà đi route desktop → ép về tabs
  if (!isDesktop && !url.startsWith('/tabs')) {
    router.navigateByUrl('/tabs/home');
    return false;
  }

  // 💻 Desktop mà đi tabs → ép về home
  if (isDesktop && url.startsWith('/tabs')) {
    router.navigateByUrl('/home');
    return false;
  }

  return true;
};
