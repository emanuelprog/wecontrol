import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moai-monthly-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moai-monthly-card.component.html',
  styleUrl: './moai-monthly-card.component.scss'
})
export class MoaiMonthlyCardComponent {
  @Input() month: string = '';
  @Input() bidStartDate: string = '';
  @Input() bidEndDate: string = '';
  @Input() highestBid: string = '';
  @Input() highestBidUser: string = '';
  @Input() status: string = '';
  @Input() disabled: boolean = false;
  currentDate: Date | undefined;
}
