import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';
import { RegisterLayoutComponent } from './components/register-layout/register-layout.component';
import { LoggedComponent } from './components/logged/logged.component';

export const routes: Routes = [
  { path: 'login', component: LoginLayoutComponent },
  { path: 'register', component: RegisterLayoutComponent },
  { path: 'logged', component: LoggedComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

