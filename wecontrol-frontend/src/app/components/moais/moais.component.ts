import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MoaiService } from '../../services/moai/moai.service';
import { MoaiResponse } from '../../models/moai.model';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-moais',
  standalone: true,
  imports: [SlickCarouselModule, NgForOf, CardComponent],
  templateUrl: './moais.component.html',
  styleUrl: './moais.component.scss'
})
export class MoaisComponent implements OnInit {
  moais: MoaiResponse[] = [];

  constructor(private moaiService: MoaiService) {}

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


  createMoai() {
    // const createJson = {
    //   login: registerForm.get('login')?.value,
    //   password: registerForm.get('password')?.value,
    //   role: registerForm.get('role')?.value,
    //   name: registerForm.get('name')?.value,
    //   email: registerForm.get('email')?.value
    // }
  }
}
