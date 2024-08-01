import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaiCardComponent } from './moai-card.component';

describe('MoaiCardComponent', () => {
  let component: MoaiCardComponent;
  let fixture: ComponentFixture<MoaiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoaiCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoaiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
