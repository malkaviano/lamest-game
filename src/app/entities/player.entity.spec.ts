import { instance, when } from 'ts-mockito';

import { PlayerEntity } from './player.entity';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeIdentity,
  fakeSkills,
  simpleSword,
} from '../../../tests/fakes';
import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
} from '../../../tests/mocks';

describe('PlayerEntity', () => {
  describe('classification', () => {
    it('return PLAYER', () => {
      expect(fakeCharacter().classification).toEqual('PLAYER');
    });
  });
});

const fakeCharacter = () =>
  new PlayerEntity(
    fakeIdentity,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior)
  );

when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

when(mockedActorBehavior.skills).thenReturn(fakeSkills);

when(mockedActorBehavior.derivedAttributes).thenReturn(fakeDerivedAttributes);

when(mockedEquipmentBehavior.equip(simpleSword)).thenReturn(null);
