import { TestBed } from '@angular/core/testing';

import { EventHubHelperService } from './event-hub.helper.service';

describe('EventHubHelperService', () => {
  let service: EventHubHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventHubHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
