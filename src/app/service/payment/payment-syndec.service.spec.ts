import { TestBed } from '@angular/core/testing';

import { PaymentSyndecService } from './payment-syndec.service';

describe('PaymentSyndecService', () => {
  let service: PaymentSyndecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSyndecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
