import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentContratVenteComponent } from './payment-contrat-vente.component';

describe('PaymentContratVenteComponent', () => {
  let component: PaymentContratVenteComponent;
  let fixture: ComponentFixture<PaymentContratVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentContratVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentContratVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
