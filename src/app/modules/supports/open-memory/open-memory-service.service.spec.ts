import { TestBed } from '@angular/core/testing';

import { OpenMemoryServiceService } from './open-memory-service.service';

describe('OpenMemoryServiceService', () => {
  let service: OpenMemoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenMemoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
