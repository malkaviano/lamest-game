import { MagazineBehavior } from './magazine.behavior';
import { errorMessages } from '../definitions/error-messages.definition';

import { magazineDefinition } from '../../../tests/fakes';

describe('MagazineBehavior', () => {
  describe('info', () => {
    describe('when magazine was created', () => {
      it('return empty 9mm magazine', () => {
        const result = fakeMagazine().info();

        expect(result).toEqual({
          name: 'MAGAZINE',
          quantity: 0,
          caliber: '9MM',
        });
      });
    });

    describe('when magazine was reloaded', () => {
      it('return empty 9mm magazine', () => {
        const magazine = fakeMagazine();

        magazine.reload(magazineDefinition('9MM', 17));

        const result = magazine.info();

        expect(result).toEqual({
          name: 'MAGAZINE',
          quantity: 17,
          caliber: '9MM',
        });
      });
    });
  });

  describe('reload', () => {
    describe('when magazine was empty', () => {
      it('return null', () => {
        const result = fakeMagazine().reload(magazineDefinition('9MM', 17));

        expect(result).toBeNull();
      });
    });

    describe('when magazine was not empty', () => {
      it('return old magazine', () => {
        const magazine = fakeMagazine();

        const expected = magazineDefinition('9MM', 17);

        magazine.reload(expected);

        const result = magazine.reload(magazineDefinition('9MM', 10));

        expect(result).toEqual(expected);
      });
    });

    describe('when loading a magazine with wrong caliber', () => {
      it('throw Wrong item was used', () => {
        expect(() =>
          fakeMagazine().reload(magazineDefinition('5.56MM', 20))
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });
  });

  describe('drop', () => {
    describe('when magazine was empty', () => {
      it('return 0', () => {
        const result = fakeMagazine().drop();

        expect(result).toEqual(0);
      });
    });

    describe('when magazine was not empty', () => {
      it('return 0', () => {
        const magazine = fakeMagazine();

        magazine.reload(magazineDefinition('9MM', 17));

        const result = magazine.drop();

        expect(result).toEqual(1);
      });
    });
  });
});

const fakeMagazine = () => new MagazineBehavior('9MM');
