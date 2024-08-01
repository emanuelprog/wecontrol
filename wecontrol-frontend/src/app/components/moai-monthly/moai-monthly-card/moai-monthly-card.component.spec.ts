import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaiMonthlyCardComponent } from './moai-monthly-card.component';

describe('MoaiMonthlyCardComponent', () => {
  let component: MoaiMonthlyCardComponent;
  let fixture: ComponentFixture<MoaiMonthlyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoaiMonthlyCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoaiMonthlyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
