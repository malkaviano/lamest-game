import { instance } from 'ts-mockito';

import { ConverterHelper } from '@helpers/converter.helper';
import { ActorEntity } from '@entities/actor.entity';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { emptyState } from '@states/empty.state';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';

import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
  mockedInteractiveEntity,
  setupMocks,
  mockedAiBehavior,
  mockedCooldownBehavior,
} from '../../../tests/mocks';

const actor = new ActorEntity(
  new ActorIdentityDefinition('id1', 'actor', 'Some Actor', 'VISIBLE'),
  emptyState,
  instance(mockedActorBehavior),
  instance(mockedEquipmentBehavior),
  emptyState,
  {
    regeneratorBehavior: new RegeneratorBehavior(),
    aiBehavior: instance(mockedAiBehavior),
    cooldownBehavior: instance(mockedCooldownBehavior),
  }
);

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
    [
      {
        actor,
        expected: actor,
      },
      {
        actor: instance(mockedInteractiveEntity),
        expected: null,
      },
    ].forEach(({ actor, expected }) => {
      it(`return ${expected}`, () => {
        expect(ConverterHelper.asActor(actor)).toEqual(expected);
      });
    });
  });
});
