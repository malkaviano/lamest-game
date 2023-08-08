import { instance } from 'ts-mockito';

import { ConverterHelper } from '@helpers/converter.helper';
import { ActorEntity } from '@entities/actor.entity';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { emptyState } from '@states/empty.state';

import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
  setupMocks,
  mockedAiBehavior,
  mockedCooldownBehavior,
  mockedRegeneratorBehavior,
} from '../../../tests/mocks';

describe('ConverterHelper', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('mapToKeyValueInterface', () => {
    it('return ROKeyValueWrapper', () => {
      const map = new Map<string, number>();

      map.set('gg', 12);
      map.set('xpto', 100);

      const result = ConverterHelper.mapToKeyValueInterface(map);

      expect(result).toEqual({
        gg: 12,
        xpto: 100,
      });
    });
  });

  describe('asActor', () => {
    it('return actor', () => {
      const actor = fakeActor();

      expect(ConverterHelper.asActor(actor)).toEqual(actor);
    });
  });
});

const fakeActor = () =>
  new ActorEntity(
    new ActorIdentityDefinition('id1', 'actor', 'Some Actor', 'VISIBLE'),
    emptyState,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior),
    emptyState,
    {
      regeneratorBehavior: instance(mockedRegeneratorBehavior),
      aiBehavior: instance(mockedAiBehavior),
      cooldownBehavior: instance(mockedCooldownBehavior),
    }
  );
