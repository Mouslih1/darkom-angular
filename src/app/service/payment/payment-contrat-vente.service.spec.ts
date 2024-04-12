import { TestBed } from '@angular/core/testing';

import { PaymentContratVenteService } from './payment-contrat-vente.service';

describe('PaymentContratVenteService', () => {
  let service: PaymentContratVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentContratVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
