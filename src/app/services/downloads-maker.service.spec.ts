import { TestBed } from '@angular/core/testing';

import { DownloadsMakerService } from './downloads-maker.service';

describe('DownloadsMakerService', () => {
  let service: DownloadsMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadsMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
