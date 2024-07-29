import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

export const AuthGuard = async () => {
    const router = inject(Router);

    return StorageService.getItem('accessToken') && StorageService.getItem('user') ? true : router.navigateByUrl('/login')
}

