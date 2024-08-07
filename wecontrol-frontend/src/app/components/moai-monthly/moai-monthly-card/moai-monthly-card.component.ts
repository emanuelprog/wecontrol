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
  @Output() bid = new EventEmitter<void>();
  @Output() pay = new EventEmitter<void>();
  @Output() notifyW = new EventEmitter<void>();
  @Output() notifyE = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  @ViewChild('bidsModal') bidsModal!: TemplateRef<any>;
  @ViewChild('paysModal') paysModal!: TemplateRef<any>;

  currentDate: Date | undefined;

  payStatusList: any[] = [];

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

  onNotifyUsersViaWhatsapp(user: any) {
    this.notifyW.emit(user);
  }

  onNotifyUsersViaEmail(user: any) {
    this.notifyE.emit(user);
  }

  openBidsModal(): void {
    this.modalService.open(this.bidsModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openPaysModal() {
    this.payStatusList = this.participants.map(participant => {
      const payment = this.pays.find(pay => pay.user.id === participant.id);
      let paymentValue = this.extractNumber(this.moai?.value!)!;

      if (this.highestBid?.user.id == participant.id) {
        paymentValue = paymentValue + this.highestBid.valueBid;
      }
      return {
        participant: participant,
        status: payment ? 'Paid out' : 'I do not pay',
        valuePay: paymentValue
      };
    });

    this.modalService.open(this.paysModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  extractNumber(value: string): number {
    const numericValue = value.replace(/[^0-9.]+/g, '');
    const parsedValue = parseFloat(numericValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
}
