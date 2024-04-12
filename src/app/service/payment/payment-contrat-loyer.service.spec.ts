import { TestBed } from '@angular/core/testing';

import { PaymentContratLoyerService } from './payment-contrat-loyer.service';

describe('PaymentContratLoyerService', () => {
  let service: PaymentContratLoyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentContratLoyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
