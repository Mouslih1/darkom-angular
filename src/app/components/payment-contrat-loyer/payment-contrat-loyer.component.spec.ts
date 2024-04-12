import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentContratLoyerComponent } from './payment-contrat-loyer.component';

describe('PaymentContratLoyerComponent', () => {
  let component: PaymentContratLoyerComponent;
  let fixture: ComponentFixture<PaymentContratLoyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentContratLoyerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentContratLoyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
