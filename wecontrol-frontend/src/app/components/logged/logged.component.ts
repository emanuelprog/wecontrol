import { Component } from '@angular/core';

@Component({
  selector: 'app-logged',
  standalone: true,
  imports: [],
  templateUrl: './logged.component.html',
  styleUrl: './logged.component.scss'
})
export class LoggedComponent {
  login: string | null = '';

  constructor() {
    this.login = sessionStorage.getItem('login');
  }
}
