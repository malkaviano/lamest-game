import { TestBed } from '@angular/core/testing';

import { StatesStore } from './states.store';

describe('StatesStore', () => {
  let service: StatesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
