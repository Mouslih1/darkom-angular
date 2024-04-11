import { TestBed } from '@angular/core/testing';

import { TravauxService } from './travaux.service';

describe('TravauxService', () => {
  let service: TravauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
