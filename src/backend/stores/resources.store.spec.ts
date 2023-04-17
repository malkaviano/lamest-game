import { TestBed } from '@angular/core/testing';

import { ResourcesStore } from './resources.store';

describe('ResourcesStore', () => {
  let service: ResourcesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
