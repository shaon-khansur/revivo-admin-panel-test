import { TestBed } from '@angular/core/testing';

import { AmaFlightOrderService } from './ama-flight-order.service';

describe('AmaFlightOrderService', () => {
  let service: AmaFlightOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmaFlightOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
