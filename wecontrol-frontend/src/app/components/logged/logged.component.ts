import { Component } from '@angular/core';
import { LoginResponse } from '../../models/login.model';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-logged',
  standalone: true,
  imports: [],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss'
})
export class LoggedComponent {
  loginResponse: LoginResponse | undefined;

  constructor(private authService: AuthService) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;
  }
}
