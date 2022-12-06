import { TestBed } from '@angular/core/testing';

import { ActorStore } from './actor.store';

describe('ActorStore', () => {
  let service: ActorStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActorStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
