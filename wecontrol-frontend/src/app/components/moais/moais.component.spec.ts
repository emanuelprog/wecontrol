import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaisComponent } from './moais.component';

describe('MoaisComponent', () => {
  let component: MoaisComponent;
  let fixture: ComponentFixture<MoaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
