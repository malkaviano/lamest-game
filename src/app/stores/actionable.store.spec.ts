import { TestBed } from '@angular/core/testing';

import { ActionableStore } from './actionable.store';

describe('ActionableStore', () => {
  let service: ActionableStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionableStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
