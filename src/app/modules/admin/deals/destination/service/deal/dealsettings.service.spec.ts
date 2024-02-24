import { TestBed } from '@angular/core/testing';

import { DealsettingsService } from './dealsettings.service';

describe('DealsettingsService', () => {
  let service: DealsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
