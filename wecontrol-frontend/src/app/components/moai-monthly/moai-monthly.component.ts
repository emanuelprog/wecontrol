import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MoaiMonthlyResponse } from '../../models/moai-monthly.model';
import { MoaiMonthlyService } from '../../services/moai/moai-monthly.service';
import { MoaiResponse } from '../../models/moai.model';
import { MoaiMonthlyCardComponent } from './moai-monthly-card/moai-monthly-card.component';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-moai-monthly',
  standalone: true,
  imports: [ToolbarComponent, MoaiMonthlyCardComponent, NgForOf, CommonModule],
  templateUrl: './moai-monthly.component.html',
  styleUrl: './moai-monthly.component.scss'
})
export class MoaiMonthlyComponent implements OnInit {
  moaiMonthlys: MoaiMonthlyResponse[] = [];
  moai: MoaiResponse | undefined;
  constructor(private route: Router, private moaiMonthlyService: MoaiMonthlyService) { }

  ngOnInit(): void {
    if (history.state && history.state.data) {
      this.moai = history.state.data;
      this.findMoaiMonthly(this.moai?.id!);
    } 
  }

  back() {
    this.route.navigate(['/logged']);
  }

  findMoaiMonthly(id: string) {
    this.moaiMonthlyService.findAllByMoaiId(id).subscribe({
      next: data => {
        if (data.body) {
          this.moaiMonthlys = data.body.body;
          console.log(this.moaiMonthlys);
          
        } else {
          this.route.navigate(['/logged']);
        }
      },
      error: (err: any) => {
        this.route.navigate(['/logged']);
      }
    })
  }

  canYouBid(moaiMonthly: any): boolean {
    return !(new Date() >= this.convertStringToDate(moaiMonthly.bidStartDate) && new Date() <= this.convertStringToDate(moaiMonthly.bidEndDate));
  }

  convertStringToDate(date: string): Date {
    const [datePart, timePart] = date.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }
}
