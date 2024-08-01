import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { MoaiService } from '../../services/moai/moai.service';
import { MoaiResponse } from '../../models/moai.model';
import { MoaiCardComponent } from './moai-card/moai-card.component';
import { LoginResponse } from '../../models/login.model';
import { StorageService } from '../../services/storage/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MoaiParticipantService } from '../../services/moai/moai-participant.service';

@Component({
  selector: 'app-moais',
  standalone: true,
  imports: [SlickCarouselModule, NgForOf, MoaiCardComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './moais.component.html',
  styleUrl: './moais.component.scss'
})
export class MoaisComponent implements OnInit {
  @ViewChild('slickModal', { static: false }) slickModal!: SlickCarouselComponent;
  @ViewChild('createMoaiModal') createMoaiModal!: TemplateRef<any>;
  moais: MoaiResponse[] = [];
  durations: string[] = [];
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
    private moaiParticipantService: MoaiParticipantService
    ) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;
    this.currentYear = new Date().getFullYear().toString();
    
    this.moaiForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      rules: ['', Validators.required],
      status: ['Open'],
      duration: ['', Validators.required]
    });
  }

  slideConfig = {
    arrows: false,
    dots: true,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: true,
    speed: 500
  };

  ngOnInit(): void {
    this.findMoais();
  }

  findMoais() {
    this.moaiService.findAll(this.loginResponse?.id!).subscribe({
      next: data => {
        if (data.body) {
          this.slickModal.unslick();
          this.moais = data.body.body;
        }
      },
      error: (err: any) => {
      }
    })
  }


  openCreateMoaiModal() {
    this.moaiForm.reset();
    this.durations = Array.from({ length: 12 }, (_, i) => `${i + 1} Month${i + 1 > 1 ? 's' : ''}`);
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
      duration: this.moaiForm.get('duration')?.value,
      status: 'Open',
      organizer: this.loginResponse
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
      duration: this.moaiForm.get('duration')?.value,
      status: this.moaiForm.get('status')?.value,
      organizer: this.loginResponse
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
      status: moai.status,
      duration: moai.duration
    });
    this.currentYear = moai.year;
    this.durations = Array.from({ length: 12 }, (_, i) => `${i + 1} Month${i + 1 > 1 ? 's' : ''}`);
    this.modalService.open(this.createMoaiModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  onViewMoai(moai: MoaiResponse) {
    this.route.navigate(['/moai-monthly'], { state: { data: moai } });
  }

  onParticipateMoai(moai: MoaiResponse) {
    const participantJson = {
      participant: this.loginResponse,
      idMoai: moai.id
    }
    this.moaiParticipantService.create(participantJson).subscribe({
      next: data => {
        if (data.body) {
          this.onMessage(data.body.message + ` ${moai.name}.`, '', 2000);
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

  mascaraMoeda(event: any): void {
    const onlyDigits = event.target.value
      .split("")
      .filter((s: string) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    this.moaiForm.get('value')?.setValue(this.mascaraCurrency(digitsFloat));
  }
  
  mascaraCurrency(valor: string, locale: string = 'en-US', currency: string = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(parseFloat(valor));
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
