import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getCurrentUserRole();

  // Nếu chưa đăng nhập
  if (!isLoggedIn) {
    router.navigate(['/signin']);
    return false;
  }

  // Nếu là customer mà truy cập vào dashboard hoặc ebook thì chặn
  if (
    userRole === 'customer' &&
    (state.url.startsWith('/dashboard') || state.url.startsWith('/ebook'))
  ) {
    router.navigate(['']);
    return false;
  }

  // Cho phép admin
  return true;
};
