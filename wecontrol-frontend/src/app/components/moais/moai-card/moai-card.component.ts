import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginResponse } from '../../../models/login.model';
import { StorageService } from '../../../services/storage/storage.service';
import { MoaiParticipantResponse } from '../../../models/moai-participant.model';

@Component({
  selector: 'app-moai-card',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatTooltipModule],
  templateUrl: './moai-card.component.html',
  styleUrl: './moai-card.component.scss'
})
export class MoaiCardComponent {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() year: string = '';
  @Input() duration: string = '';
  @Input() status: string = '';
  @Input() organizer: string = '';
  @Input() rules: string = '';
  @Input() createdAt: string = '';
  @Input() participants: MoaiParticipantResponse[] = [];
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();
  @Output() participate = new EventEmitter<void>();
  
  @ViewChild('rulesModal') rulesModal!: TemplateRef<any>;
  @ViewChild('participantsModal') participantsModal!: TemplateRef<any>;
  loginResponse: LoginResponse | undefined;

  constructor(private modalService: NgbModal) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;
  }

  isParticipant() {
    return this.participants?.some(participant => participant.participant.id === this.loginResponse?.id);
  }

  openParticipantsModal(): void {
    this.modalService.open(this.participantsModal);
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

  onView() {
    this.view.emit();
  }

  onParticipate() {
    this.participate.emit();
  }
}
