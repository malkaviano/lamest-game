import { TestBed } from '@angular/core/testing';
import { readable } from '../../../tests/fakes';
import { ReadableInterface } from '../interfaces/readable.interface';

import { ReadAxiomService } from './read.axiom.service';

describe('ReadAxiomService', () => {
  let service: ReadAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDocument', () => {
    it('should emit documentOpened event', (done) => {
      const result: ReadableInterface[] = [];

      service.documentOpened$.subscribe((event) => {
        result.push(event);
      });

      service.openDocument(readable);

      done();

      expect(result).toEqual([docEvent]);
    });
  });
});

const docEvent = {
  title: readable.title,
  text: readable.text,
};
