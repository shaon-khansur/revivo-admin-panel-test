import { TestBed } from '@angular/core/testing';

import { FareFamilyServiceService } from './fare-family-service.service';

describe('FareFamilyServiceService', () => {
  let service: FareFamilyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FareFamilyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
