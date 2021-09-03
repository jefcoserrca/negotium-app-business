import { TestBed } from '@angular/core/testing';

import { StoreGuardService } from './store-guard.service';

describe('StoreGuardService', () => {
  let service: StoreGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
