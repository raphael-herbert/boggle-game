import { TestBed } from '@angular/core/testing';

import { BoggleHubService } from './boggle-hub.service';

describe('BoggleHubService', () => {
  let service: BoggleHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoggleHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
