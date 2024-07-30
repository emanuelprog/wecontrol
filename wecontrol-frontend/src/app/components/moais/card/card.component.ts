import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginResponse } from '../../../models/login.model';
import { StorageService } from '../../../services/storage/storage.service';

registerLocaleData(localePt, 'pt');
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatTooltipModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' }
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() year: string = '';
  @Input() duration: string = '';
  @Input() status: string = '';
  @Input() organizer: string = '';
  @Input() rules: string = '';
  
  @ViewChild('rulesModal') rulesModal!: TemplateRef<any>;
  loginResponse: LoginResponse | undefined;

  constructor(private modalService: NgbModal) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;
  }

  openRules() {
    this.modalService.open(this.rulesModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
