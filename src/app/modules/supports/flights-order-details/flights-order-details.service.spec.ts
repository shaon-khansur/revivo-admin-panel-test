import { TestBed } from '@angular/core/testing';

import { FlightsOrderDetailsService } from './flights-order-details.service';

describe('FlightsOrderDetailsService', () => {
  let service: FlightsOrderDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightsOrderDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
