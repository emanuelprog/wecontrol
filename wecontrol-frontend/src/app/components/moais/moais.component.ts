import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { MoaiService } from '../../services/moai/moai.service';
import { MoaiResponse } from '../../models/moai-response.model';
import { MoaiCardComponent } from './moai-card/moai-card.component';
import { LoginResponse } from '../../models/login.model';
import { StorageService } from '../../services/storage/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-moais',
  standalone: true,
  imports: [NgForOf, MoaiCardComponent, CommonModule, FormsModule, ReactiveFormsModule, MatPaginator],
  templateUrl: './moais.component.html',
  styleUrl: './moais.component.scss'
})
export class MoaisComponent implements OnInit {
  @ViewChild('slickModal', { static: false }) slickModal!: SlickCarouselComponent;
  @ViewChild('createMoaiModal') createMoaiModal!: TemplateRef<any>;
  @ViewChild('paginator') paginator!: MatPaginator;

  moais: MoaiResponse[] = [];
  currentItemsToShow: MoaiResponse[] = [];

  loginResponse: LoginResponse | undefined;
  moaiEdit: MoaiResponse | undefined;
  moaiDelete: MoaiResponse | null = null;
  moaiForm: FormGroup;

  isEdit: boolean = false;
  currentYear: string;

  constructor(
    private moaiService: MoaiService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: Router,
    private authService: AuthService,
    ) {
    this.loginResponse = StorageService.getUser(sessionStorage.getItem('currentUser')!).user;
    this.currentYear = new Date().getFullYear().toString();

    this.moaiForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      rules: ['', Validators.required],
      status: ['Open']
    });
  }

  ngOnInit(): void {
    this.findMoais();
  }

  findMoais() {
    this.moaiService.findAll(this.loginResponse?.id!).subscribe({
      next: data => {
        if (data.body) {
          this.moais = data.body.body;
          this.onPageChange({ pageIndex: 0, pageSize: 2 });
        }
      },
      error: (err: any) => {
        this.authService.logout();
      }
    })
  }

  onPageChange($event: { pageIndex?: any; pageSize?: any; }) {
    this.currentItemsToShow = this.moais.slice($event.pageIndex * $event.pageSize, $event.pageIndex * $event.pageSize + $event.pageSize);
  }

  openCreateMoaiModal() {
    this.moaiForm.reset();
    this.modalService.open(this.createMoaiModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.isEdit = false;
  }

  onSubmit() {
    if (this.moaiForm.valid) {
      if (!this.isEdit) {
        this.createMoai();
      } else {
        this.editMoai();
      }
    } else {
      this.onMessage('Invalid form. Please verify!', '', 2000);
      this.moaiForm.markAllAsTouched();
    }
  }

  createMoai() {
    const createJson = {
      name: this.moaiForm.get('name')?.value,
      value: this.moaiForm.get('value')?.value,
      year: this.currentYear,
      rules: this.moaiForm.get('rules')?.value,
      status: 'Open',
      organizer: {
        id: this.loginResponse?.id,
        email: this.loginResponse?.email,
        name: this.loginResponse?.name
      }
    }
    this.moaiService.create(createJson).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message, '', 2000);
          this.closeModal();
          this.findMoais();
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  editMoai() {
    const editJson = {
      id: this.moaiEdit?.id,
      name: this.moaiForm.get('name')?.value,
      value: this.moaiForm.get('value')?.value,
      year: this.currentYear,
      rules: this.moaiForm.get('rules')?.value,
      status: this.moaiForm.get('status')?.value,
      organizer: {
        id: this.loginResponse?.id,
        email: this.loginResponse?.email,
        name: this.loginResponse?.name
      }
    }
    this.moaiService.edit(editJson).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message, '', 2000);
          this.closeModal();
          this.findMoais();
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  onEditMoai(moai: MoaiResponse) {
    this.moaiEdit = moai;
    this.isEdit = true;
    this.moaiForm.reset();
    this.moaiForm.patchValue({
      name: moai.name,
      value: moai.value,
      rules: moai.rules,
      status: moai.status
    });
    this.currentYear = moai.year;
    this.modalService.open(this.createMoaiModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  onViewMoai(moai: MoaiResponse) {
    this.route.navigate(['/moai-monthly'], { state: { data: moai } });
  }

  onParticipateMoai(moai: MoaiResponse) {
    moai.participants?.push(this.loginResponse!);

    this.moaiService.edit(moai).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message + ` ${moai.name}.`, '', 2000);
          this.findMoais();
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  openConfirmDeleteModal(moai: MoaiResponse, modal: TemplateRef<any>) {
    this.moaiDelete = moai;
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteConfirmed(modal: any) {
    if (this.moaiDelete) {
      this.moaiService.delete(this.moaiDelete.id).subscribe({
        next: (response) => {
          this.onMessage(response.body.message, '', 2000);
          this.closeModal();
          this.findMoais();
        },
        error: (err) => {
          this.closeModal();
          this.onMessage(err.error.message, '', 2000);
        }
      });
    }
    this.moaiDelete = null;
  }

  filterInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.moaiForm.controls[controlName].setValue(input.value);
  }

  maskCoin(event: any): void {

    const input = event.target.value.replace(/[^0-9]/g, '');
    if (input == '00') {
      this.moaiForm.get('value')?.setValue('');
      return;
    }

    const onlyDigits = event.target.value
      .split("")
      .filter((s: string) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    this.moaiForm.get('value')?.setValue(this.maskCurrency(digitsFloat));
  }

  maskCurrency(valor: string, locale: string = 'en-US', currency: string = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(parseFloat(valor));
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
