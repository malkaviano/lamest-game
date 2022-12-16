import { TestBed } from '@angular/core/testing';
import { mockedActorEntity } from '../../../tests/mocks';
import { errorMessages } from '../definitions/error-messages.definition';

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

  describe('extractRuleTarget', () => {
    describe('when target is undefined', () => {
      it('throw Action should not happen', () => {
        expect(() => service.extractRuleTarget({})).toThrowError(
          errorMessages['SHOULD-NOT-HAPPEN']
        );
      });
    });

    describe('when target is defined', () => {
      it('return target', () => {
        expect(
          service.extractRuleTarget({ target: mockedActorEntity })
        ).toEqual(mockedActorEntity);
      });
    });
  });
});
