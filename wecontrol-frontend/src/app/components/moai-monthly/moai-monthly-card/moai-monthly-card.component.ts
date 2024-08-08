import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidResponse } from '../../../models/bid.model';
import { PayResponse } from '../../../models/pay.model';
import { LoginResponse } from '../../../models/login.model';
import { MoaiResponse } from '../../../models/moai-response.model';

@Component({
  selector: 'app-moai-monthly-card',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatDividerModule],
  templateUrl: './moai-monthly-card.component.html',
  styleUrl: './moai-monthly-card.component.scss'
})
export class MoaiMonthlyCardComponent {
  @Input() admin: boolean = false;
  @Input() month: string = '';
  @Input() bidStartDate: string = '';
  @Input() bidEndDate: string = '';
  @Input() bids: BidResponse[] = [];
  @Input() status: string = '';
  @Input() disabled: boolean = false;
  @Input() role: string | undefined;
  @Input() youBid: BidResponse | undefined;
  @Input() youPay: PayResponse | undefined;
  @Input() closeBids: boolean = false;
  @Input() highestBid: BidResponse | undefined;
  @Input() pays: PayResponse[] = [];
  @Input() participants: LoginResponse[] = [];
  @Input() moai: MoaiResponse | undefined;
  @Input() hasHighestBidInAnyMonthly: boolean = false;
  @Input() payStatusList: any[] = [];;
  @Output() bid = new EventEmitter<void>();
  @Output() pay = new EventEmitter<void>();
  @Output() draw = new EventEmitter<void>();
  @Output() payStatusListEvt = new EventEmitter<void>();
  @Output() notifyW = new EventEmitter<void>();
  @Output() notifyE = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() sendProof = new EventEmitter<void>();
  
  @ViewChild('bidsModal') bidsModal!: TemplateRef<any>;
  @ViewChild('paysModal') paysModal!: TemplateRef<any>;
  
  currentDate: Date | undefined;

  constructor(private modalService: NgbModal) {}

  onBid() {
    this.bid.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onPay(user: any) {
    this.pay.emit(user);
  }

  onSendProof() {
    this.sendProof.emit();
  }

  onNotifyUsersViaWhatsapp(user: any) {
    this.notifyW.emit(user);
  }

  onNotifyUsersViaEmail(user: any) {
    this.notifyE.emit(user);
  }

  onDraw() {
    this.draw.emit();
  }

  onPayStatusList() {
    this.payStatusListEvt.emit();
  }

  openBidsModal(): void {
    this.modalService.open(this.bidsModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openPaysModal() {
    this.onPayStatusList();
    this.modalService.open(this.paysModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  get cardOpacity(): string {
    return this.status === 'Open' ? '1' : '0.5';
  }

  get statusColor(): string {
    return this.status === 'Open' ? 'green' : 'red';
  }

  get showBidStartDate(): boolean {
    return !!this.bidStartDate;
  }

  get showBidEndDate(): boolean {
    return !!this.bidEndDate;
  }

  get showHighestBid(): boolean {
    return this.closeBids;
  }

  get showBidButton(): boolean {
    return !(this.bids.length > 0 && this.closeBids) && !this.hasHighestBidInAnyMonthly && !this.closeBids && this.status == 'Open';
  }

  get showDeleteButton(): boolean {
    return this.youBid! && !this.disabled && !(this.bids.length > 0 && this.closeBids);
  }

  get showSendProofButton(): boolean {
    return !this.youPay;
  }

  get showViewBidsButton(): boolean {
    return this.bids.length > 0 && !(this.bids.length > 0 && this.closeBids && !this.admin) && this.status == 'Open';
  }

  get showPaymentsButton(): boolean {
    return this.closeBids && this.status == 'Open';
  }

  get userPaymentStatus(): string {
    return this.youPay ? 'Paid out' : 'I do not pay';
  }

  get userPaymentClass(): string {
    return this.youPay ? 'text-success' : 'text-danger';
  }

  get numberOfBidsMessage(): string {
    return this.bids.length == 0 ? 'No bids yet' : 'Number of bids:' + this.bids.length;
  }

  statusTextClass(status: string): string {
    return status === 'Paid out' ? 'text-success' : 'text-danger';
  }

  get canNotifyUsers(): boolean {
    return this.admin && this.closeBids && this.status === 'Open';
  }

  get showDrawButton(): boolean {
    return this.admin && this.bids.length <= 0 && this.status === 'Open' && this.closeBids;
  }

  getBidRowClass(index: number): string {
    return (index + 1) == 1 ? 'text-success' : 'text-danger';
  }
}
