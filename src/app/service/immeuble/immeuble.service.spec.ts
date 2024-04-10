import { TestBed } from '@angular/core/testing';

import { ImmeubleService } from './immeuble.service';

describe('ImmeubleService', () => {
  let service: ImmeubleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImmeubleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
