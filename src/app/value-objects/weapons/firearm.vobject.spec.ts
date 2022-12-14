import { instance, when } from 'ts-mockito';

import { DamageDefinition } from '../../definitions/damage.definition';
import { createDice } from '../../definitions/dice.definition';
import { ItemIdentityDefinition } from '../../definitions/item-identity.definition';
import { FirearmValueObject } from './firearm.vobject';

import { mockedMagazineBehavior, setupMocks } from '../../../../tests/mocks';
import { magazineDefinition } from '../../../../tests/fakes';

describe('FirearmValueObject', () => {
  beforeEach(() => {
    setupMocks();

    when(mockedMagazineBehavior.info()).thenReturn({
      name: 'MAGAZINE',
      quantity: 0,
      caliber: '9MM',
    });
  });

  describe('magazine', () => {
    it('should have empty magazine', () => {
      expect(g17.magazine).toEqual({
        name: 'MAGAZINE',
        quantity: 0,
        caliber: '9MM',
      });
    });
  });

  describe('reload', () => {
    it('return null', () => {
      expect(g17.reload(magazineDefinition('9MM', 5))).toBeNull();
    });
  });
});

const g17 = new FirearmValueObject(
  new ItemIdentityDefinition('g17', 'Glock 17', '9mm reliable'),
  'Firearm (Handgun)',
  new DamageDefinition(createDice({ D4: 1 }), 2),
  false,
  'PERMANENT',
  instance(mockedMagazineBehavior)
);
