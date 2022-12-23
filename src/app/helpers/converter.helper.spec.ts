import { instance } from 'ts-mockito';

import { ConverterHelper } from './converter.helper';
import { ActorEntity } from '../entities/actor.entity';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { emptyState } from '../states/empty.state';

import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
  mockedInteractiveEntity,
  setupMocks,
} from '../../../tests/mocks';

const helper = new ConverterHelper();

const actor = new ActorEntity(
  new ActorIdentityDefinition('id1', 'actor', 'Some Actor'),
  emptyState,
  false,
  instance(mockedActorBehavior),
  instance(mockedEquipmentBehavior),
  emptyState
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

      const result = helper.mapToKeyValueInterface(map);

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
        expect(helper.asActor(actor)).toEqual(expected);
      });
    });
  });
});
