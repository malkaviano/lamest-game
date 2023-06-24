import { instance } from 'ts-mockito';

import { PlayerEntity } from './player.entity';
import { ActionableEvent } from '../events/actionable.event';

import { fakeIdentity, actionConsume } from '../../../tests/fakes';
import {
  mockedActorBehavior,
  mockedCooldownBehavior,
  mockedEquipmentBehavior,
  setupMocks,
} from '../../../tests/mocks';

beforeEach(() => {
  setupMocks();
});

describe('PlayerEntity', () => {
  describe('classification', () => {
    it('return PLAYER', () => {
      expect(fakeCharacter().classification).toEqual('PLAYER');
    });
  });

  describe('action', () => {
    describe('when player made no decision', () => {
      it('return null', () => {
        expect(fakeCharacter().action()).toBeNull();
      });
    });

    describe('when player choose consumable', () => {
      it('return consumable event', () => {
        const char = fakeCharacter();

        const expected = new ActionableEvent(actionConsume, 'firstAid');

        char.playerDecision(expected);

        expect(char.action()).toEqual(expected);
      });
    });
  });

  describe('behavior', () => {
    it('return PLAYER', () => {
      expect(fakeCharacter().behavior).toEqual('PLAYER');
    });
  });
});

const fakeCharacter = () =>
  new PlayerEntity(
    fakeIdentity,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior),
    instance(mockedCooldownBehavior)
  );
