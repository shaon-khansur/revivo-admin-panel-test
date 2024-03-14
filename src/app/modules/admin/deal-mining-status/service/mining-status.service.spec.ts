import { TestBed } from '@angular/core/testing';

import { MiningStatusService } from './mining-status.service';

describe('MiningStatusService', () => {
  let service: MiningStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiningStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
