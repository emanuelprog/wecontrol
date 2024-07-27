import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard = async () => {
    const router = inject(Router);
    return sessionStorage.getItem('login') && sessionStorage.getItem('token') ? true : router.navigateByUrl('/login')
}

