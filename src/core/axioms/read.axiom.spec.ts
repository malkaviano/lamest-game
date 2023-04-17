import { ReadableInterface } from '../interfaces/readable.interface';
import { ReadAxiom } from './read.axiom';

import { readable } from '../../../tests/fakes';

describe('ReadAxiom', () => {
  const axiom = new ReadAxiom();

  it('should be created', () => {
    expect(axiom).toBeTruthy();
  });

  describe('openDocument', () => {
    it('should emit documentOpened event', (done) => {
      const result: ReadableInterface[] = [];

      axiom.documentOpened$.subscribe((event) => {
        result.push(event);
      });

      axiom.openDocument(readable);

      done();

      expect(result).toEqual([docEvent]);
    });
  });
});

const docEvent = {
  title: readable.title,
  text: readable.text,
};
