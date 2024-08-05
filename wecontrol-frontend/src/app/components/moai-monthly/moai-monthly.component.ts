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

@Component({
  selector: 'app-moai-monthly',
  standalone: true,
  imports: [ToolbarComponent, MoaiMonthlyCardComponent, NgForOf, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './moai-monthly.component.html',
  styleUrl: './moai-monthly.component.scss'
})
export class MoaiMonthlyComponent implements OnInit {
  @ViewChild('bidModal') bidModal!: TemplateRef<any>;
  moaiMonthlys: MoaiMonthlyResponse[] = [];

  bidForm: FormGroup;

  loginResponse: LoginResponse | undefined;
  moai: MoaiResponse | undefined;
  modalRef: NgbModalRef | undefined;
  moaiMonthly: MoaiMonthlyResponse | undefined;
  bidDelete: BidResponse | undefined;

  min: number | undefined;
  isEdit: boolean = false;

  constructor(
    private route: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private moaiService: MoaiService
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
      this.min = this.extractNumber(this.moai?.value!) * 0.10
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
        valueBid: [this.maskCurrency(bid.valueBid.toString()), [Validators.required, this.minValueValidator(this.min!)]]
      });
    } else {
      this.bidForm = this.fb.group({
        valueBid: ['', [Validators.required, this.minValueValidator(this.min!)]]
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

  closeModal() {
    this.modalService.dismissAll();
    this.isEdit = false;
  }

  extractNumber(value: string): number {
    const numericValue = value.replace(/[^0-9.]+/g, '');
    const parsedValue = parseFloat(numericValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  canYouBid(moaiMonthly: any): boolean {
    return !(new Date() >= this.convertStringToDate(moaiMonthly.bidStartDateStr) && new Date() <= this.convertStringToDate(moaiMonthly.bidEndDateStr));
  }

  youBid(bids: BidResponse[]): BidResponse | undefined {
    return bids?.find(bid => bid.user.id === this.loginResponse?.id);
  }

  closeBids(moaiMonthly: MoaiMonthlyResponse): boolean {
    return (new Date() >= this.convertStringToDate(moaiMonthly.bidEndDateStr));
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

  coinMask(event: any): void {

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
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
