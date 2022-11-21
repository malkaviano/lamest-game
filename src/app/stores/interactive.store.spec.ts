import { TestBed } from '@angular/core/testing';

import { InteractiveStore } from './interactive.store';

describe('InteractiveStore', () => {
  let service: InteractiveStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractiveStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
