import { TestBed } from '@angular/core/testing';

import { ExtractorHelper } from './extractor-target.helper';

describe('ExtractorHelper', () => {
  let service: ExtractorHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractorHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
