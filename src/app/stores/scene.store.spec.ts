import { TestBed } from '@angular/core/testing';

import { SceneStore } from './scene.store';

describe('SceneStore', () => {
  let service: SceneStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
