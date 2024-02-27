import { TestBed } from '@angular/core/testing';

import { FlightCommissionService } from './flight-commission.service';

describe('FlightCommissionService', () => {
  let service: FlightCommissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightCommissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
