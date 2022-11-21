import { TestBed } from '@angular/core/testing';

import { DescriptionStore } from './description.store';

describe('DescriptionStore', () => {
  let service: DescriptionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptionStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
