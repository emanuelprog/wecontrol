import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MoaiResponse } from '../../models/moai-response.model';
import { MoaiMonthlyCardComponent } from './moai-monthly-card/moai-monthly-card.component';
import { CommonModule, NgForOf } from '@angular/common';
import { LoginResponse } from '../../models/login.model';
import { StorageService } from '../../services/storage/storage.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { MoaiMonthlyResponse } from '../../models/moai-monthly.model';
import { BidResponse } from '../../models/bid.model';
import { MoaiService } from '../../services/moai/moai.service';
import { PayResponse } from '../../models/pay.model';
import { WhatsAppService } from '../../services/whatsapp/whatsapp.service';
import { EmailService } from '../../services/email/email.service';

@Component({
  selector: 'app-moai-monthly',
  standalone: true,
  imports: [ToolbarComponent, MoaiMonthlyCardComponent, NgForOf, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './moai-monthly.component.html',
  styleUrl: './moai-monthly.component.scss'
})
export class MoaiMonthlyComponent implements OnInit {
  @ViewChild('bidModal') bidModal!: TemplateRef<any>;
  @ViewChild('payModal') payModal!: TemplateRef<any>;
  moaiMonthlys: MoaiMonthlyResponse[] = [];

  bidForm: FormGroup;

  loginResponse: LoginResponse | undefined;
  moai: MoaiResponse | undefined;
  modalRef: NgbModalRef | undefined;
  moaiMonthly: MoaiMonthlyResponse | undefined;
  bidDelete: BidResponse | undefined;

  minBid: number | undefined;
  minPay: number | undefined;
  isEdit: boolean = false;
  phoneNumber: string = '';
  message: string = '';

  constructor(
    private route: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private moaiService: MoaiService,
    private whatsappService: WhatsAppService,
    private emailService: EmailService
    ) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;

    this.bidForm = this.fb.group({
      valueBid: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    if (history.state && history.state.data) {
      this.moai = history.state.data;
      this.minBid = this.extractNumber(this.moai?.value!) * 0.10
      this.moaiMonthlys = this.moai?.monthly!;
    }
  }

  back() {
    this.route.navigate(['/logged']);
  }

  openBidModal(moaiMonthly: MoaiMonthlyResponse) {

    let bid: BidResponse | undefined = this.youBid(moaiMonthly.bids);
    this.moaiMonthly = moaiMonthly;
    if (bid) {
      this.isEdit = true;
      this.bidForm = this.fb.group({
        valueBid: [this.maskCurrency(bid.valueBid.toString()), [Validators.required, this.minValueValidator(this.minBid!)]]
      });
    } else {
      this.bidForm = this.fb.group({
        valueBid: ['', [Validators.required, this.minValueValidator(this.minBid!)]]
      });
    }
    this.modalRef = this.modalService.open(this.bidModal);
  }

  onBid(modal: any) {
    if (this.bidForm.valid) {
      if (this.isEdit) {
        this.editBid();
      } else {
        this.createBid();
      }
      modal.close('confirm');
    }
  }

  createBid() {
    let bid: BidResponse = new BidResponse(this.loginResponse!, this.extractNumber(this.bidForm.get('valueBid')?.value));
    this.moai?.monthly.find(mo => mo == this.moaiMonthly)?.bids.push(bid);
    this.moaiService.bidMonthly(this.moai!).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message, '', 2000);
          this.closeModal();
        }
      },
      error: (err) => {
        this.onMessage(err.error.message, '', 2000);
        this.moaiMonthly = undefined;
      }
    })
  }

  editBid() {
    const bidValue = this.extractNumber(this.bidForm.get('valueBid')?.value);
    const bid = this.youBid(this.moaiMonthly?.bids!);

    if (bid) {
        const monthly = this.moai?.monthly.find(mo => mo === this.moaiMonthly);
        if (monthly) {
            const existingBid = monthly.bids.find(b => b === bid);
            if (existingBid) {
                existingBid.valueBid = bidValue;
            }
        }
    }

    this.moaiService.bidMonthly(this.moai!).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message, '', 2000);
          this.closeModal();
        }
      },
      error: (err) => {
        this.onMessage(err.error.message, '', 2000);
        this.moaiMonthly = undefined;
      }
    })
  }

  openConfirmDeleteModal(bid: BidResponse | undefined, modal: TemplateRef<any>) {
    this.bidDelete = bid;
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteConfirmed(modal: any) {
    if (this.bidDelete) {
      const monthly = this.moai?.monthly.find(mo => mo == this.moaiMonthly);

      if (monthly) {
          monthly.bids = monthly.bids.filter(bid => bid !== this.bidDelete);

          this.moaiService.deleteBid(this.moai!).subscribe({
              next: data => {
                if (data.body) {
                  this.onMessage(data.body.message, '', 2000);
                  this.closeModal();
                }
              },
              error: (err) => {
                  this.onMessage(err.error.message, '', 2000);
              }
          });
      }
      this.bidDelete = undefined;
    }
  }

  notifyUsersViaWhatsapp(user: any, moaiMonthly: MoaiMonthlyResponse) {

    if (!this.moai || !this.moai.monthly || !this.moai.participants) {
      return;
    }

    const link = this.whatsappService.buildWhatsAppLink(this.extractNumber(user.participant.cellphone), 'Bora paga o mês ' + moaiMonthly.month + ' do ' + this.moai.name + ' meu pix:' + this.loginResponse?.cellphone);
    window.open(link, '_blank');
  }

  notifyUsersViaEmail(user: any, moaiMonthly: MoaiMonthlyResponse) {
    this.emailService.confirmEmail(user.participant.email).subscribe({
      next: data => {
        if (data.body) {
          const subject = 'Bora paga o mês ' + moaiMonthly.month + ' do ' + this.moai!.name + ' meu pix:' + this.loginResponse?.cellphone;

          this.emailService.sendEmail(user.participant.email, subject, '').then(
            response => this.onMessage('E-mail sending with success', '', 2000),
            error => this.onMessage('Error sending email', '', 2000)
            );
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  sendingProof() {
    if (!this.moai || !this.moai.monthly || !this.moai.participants) {
      return;
    }
    const link = this.whatsappService.buildWhatsAppLink(this.extractNumber(this.moai.organizer.cellphone), '');
    window.open(link, '_blank');
  }

  createPay(user: any, moaiMonthly: MoaiMonthlyResponse) {
    let pay: PayResponse = new PayResponse(user.participant, user.valuePay);

    this.moai?.monthly.find(mo => mo == moaiMonthly)?.pays.push(pay);

    this.moaiService.payMonthly(this.moai!).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message, '', 2000);
          this.closeModal();
        }
      },
      error: (err) => {
        this.onMessage(err.error.message, '', 2000);
        this.moaiMonthly = undefined;
      }
    })
  }

  findMyHighestBidValue(): BidResponse | undefined {
    for (let monthly of this.moaiMonthlys) {
      let highestBid = this.highestBid(monthly.bids);

      if (highestBid) {
        let isUserParticipant = this.moai?.participants.some(participant => participant.id === highestBid.user.id);

        if (isUserParticipant) {
          return highestBid;
        }
      }
    }
    return undefined;
  }

  hasHighestBidInAnyMonthly(): boolean {
    if (!this.moaiMonthlys || !this.loginResponse) {
      return false;
    }

    for (let monthly of this.moaiMonthlys) {
      if (monthly.status == 'Closed') {
        const highestBid = this.highestBid(monthly.bids);
        if (highestBid && highestBid.user.id === this.loginResponse.id) {
          return true;
        }
      }
    }

    return false;
  }

  closeModal() {
    this.modalService.dismissAll();
    this.isEdit = false;
  }

  extractNumber(value: string): number | any {
    const numericValue = value.replace(/[^0-9.]+/g, '');
    const parsedValue = parseFloat(numericValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  canYouBid(moaiMonthly: any): boolean {
    return !(new Date() >= this.convertStringToDate(moaiMonthly.bidStartDate) && new Date() <= this.convertStringToDate(moaiMonthly.bidEndDate));
  }

  youBid(bids: BidResponse[]): BidResponse | undefined {
    return bids?.find(bid => bid.user.id === this.loginResponse?.id);
  }

  youPay(pays: PayResponse[]): PayResponse | undefined {
    return pays?.find(pay => pay.user.id === this.loginResponse?.id);
  }

  closeBids(moaiMonthly: MoaiMonthlyResponse): boolean {
    return (new Date() >= this.convertStringToDate(moaiMonthly.bidEndDate));
  }

  highestBid(bids: BidResponse[]): BidResponse | undefined {
    if (!bids || bids.length === 0) {
      return undefined;
    }
    return bids.reduce((max, bid) => bid.valueBid > max.valueBid ? bid : max, bids[0]);
  }
  convertStringToDate(date: string): Date {
    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }

  coinMaskBid(event: any): void {

    const input = event.target.value.replace(/[^0-9]/g, '');
    if (input == '00') {
      this.bidForm.get('valueBid')?.setValue('');
      return;
    }

    const onlyDigits = input.padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);

    this.bidForm.get('valueBid')?.setValue(this.maskCurrency(digitsFloat));
  }

  maskCurrency(valor: string, locale: string = 'en-US', currency: string = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(parseFloat(valor));
  }

  minValueValidator(min: number) {
    return (control: any) => {
      const value = this.extractNumber(control.value);
      return value < min ? { minValue: { requiredValue: min, actualValue: value } } : null;
    };
  }

  private onMessage(message: string, action: string, duration: number) {
    this.closeModal();
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
