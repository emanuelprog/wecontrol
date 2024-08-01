import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaiMonthlyComponent } from './moai-monthly.component';

describe('MoaiMonthlyComponent', () => {
  let component: MoaiMonthlyComponent;
  let fixture: ComponentFixture<MoaiMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoaiMonthlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoaiMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
