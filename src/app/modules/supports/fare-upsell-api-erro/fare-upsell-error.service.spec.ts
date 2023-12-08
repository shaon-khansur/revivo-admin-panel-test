import { TestBed } from '@angular/core/testing';

import { FareUpsellErrorService } from './fare-upsell-error.service';

describe('FareUpsellErrorService', () => {
  let service: FareUpsellErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FareUpsellErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
