import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidResponse } from '../../../models/bid.model';

@Component({
  selector: 'app-moai-monthly-card',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatDividerModule],
  templateUrl: './moai-monthly-card.component.html',
  styleUrl: './moai-monthly-card.component.scss'
})
export class MoaiMonthlyCardComponent {
  @Input() month: string = '';
  @Input() bidStartDate: string = '';
  @Input() bidEndDate: string = '';
  @Input() bids: BidResponse[] = [];
  @Input() status: string = '';
  @Input() disabled: boolean = false;
  @Input() role: string | undefined;
  @Input() youBid: BidResponse | undefined;
  @Input() closeBids: boolean = false;
  @Input() highestBid: BidResponse | undefined;
  @Output() bid = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  @ViewChild('bidsModal') bidsModal!: TemplateRef<any>;

  currentDate: Date | undefined;

  constructor(private modalService: NgbModal) {}

  onBid() {
    this.bid.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  openBidsModal(): void {
    this.modalService.open(this.bidsModal, { ariaLabelledBy: 'modal-basic-title' });
  }
}
