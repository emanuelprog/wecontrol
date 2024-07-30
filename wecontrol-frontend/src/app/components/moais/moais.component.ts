import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MoaiService } from '../../services/moai/moai.service';
import { MoaiResponse } from '../../models/moai.model';
import { CardComponent } from './card/card.component';
import { LoginResponse } from '../../models/login.model';
import { StorageService } from '../../services/storage/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-moais',
  standalone: true,
  imports: [SlickCarouselModule, NgForOf, CardComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './moais.component.html',
  styleUrl: './moais.component.scss'
})
export class MoaisComponent implements OnInit {
  moais: MoaiResponse[] = [];
  loginResponse: LoginResponse | undefined;
  @ViewChild('createMoaiModal') createMoaiModal!: TemplateRef<any>;
  moaiForm: FormGroup;

  constructor(private moaiService: MoaiService, private modalService: NgbModal, private fb: FormBuilder, private snackBar: MatSnackBar) {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    this.loginResponse = StorageService.getUser(currentUserUUID!).user;

    this.moaiForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      year: ['', Validators.required]
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
    this.moaiService.findAll().subscribe({
      next: data => {
        if (data.body) {
          this.moais = data.body.body;
          console.log(this.moais);
          
        }
      }
    })
  }


  openCreateMoaiModal() {
    this.moaiForm.reset();
    this.modalService.open(this.createMoaiModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit() {
    if (this.moaiForm.invalid) {
      this.moaiForm.markAllAsTouched();
    }
    console.log('New Moai:', this.moaiForm);
    // Aqui você pode adicionar a lógica para enviar os dados do novo Moai para o servidor
    this.modalService.dismissAll();
  }
}
