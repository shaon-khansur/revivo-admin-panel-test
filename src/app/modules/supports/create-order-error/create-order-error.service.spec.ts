import { TestBed } from '@angular/core/testing';

import { CreateOrderErrorService } from './create-order-error.service';

describe('CreateOrderErrorService', () => {
  let service: CreateOrderErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateOrderErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
