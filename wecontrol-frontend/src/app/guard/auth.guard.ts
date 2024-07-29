import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

export const AuthGuard = () => {
  const router = inject(Router);

  const currentUserUUID = sessionStorage.getItem('currentUser');
  
  const accessToken = currentUserUUID ? StorageService.getUser(currentUserUUID)?.accessToken : null;

  if (accessToken) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};