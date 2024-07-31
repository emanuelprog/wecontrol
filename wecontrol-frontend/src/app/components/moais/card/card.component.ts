import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginResponse } from '../../../models/login.model';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatTooltipModule],
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
  @Input() createdAt: string = '';
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  
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

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
