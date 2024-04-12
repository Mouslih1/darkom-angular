import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSyndecComponent } from './payment-syndec.component';

describe('PaymentSyndecComponent', () => {
  let component: PaymentSyndecComponent;
  let fixture: ComponentFixture<PaymentSyndecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSyndecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSyndecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
