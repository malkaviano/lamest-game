import { instance } from 'ts-mockito';

import { ConverterHelper } from '@helpers/converter.helper';
import { ActorEntity } from '@conceptual/entities/actor.entity';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { emptyState } from '@conceptual/states/empty.state';
import { RegeneratorBehavior } from '@conceptual/behaviors/regenerator.behavior';

import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
  mockedInteractiveEntity,
  setupMocks,
  mockedAiBehavior,
} from '../../../tests/mocks';

const actor = new ActorEntity(
  new ActorIdentityDefinition('id1', 'actor', 'Some Actor', 'VISIBLE'),
  emptyState,
  false,
  instance(mockedActorBehavior),
  instance(mockedEquipmentBehavior),
  emptyState,
  {
    regeneratorBehavior: new RegeneratorBehavior(),
    aiBehavior: instance(mockedAiBehavior),
  }
);

describe('ConverterHelper', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('mapToKeyValueInterface', () => {
    it('return KeyValueInterface', () => {
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
