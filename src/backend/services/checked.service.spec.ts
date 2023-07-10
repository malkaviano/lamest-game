import { instance, when } from 'ts-mockito';

import { GameStringsStore } from '../../stores/game-strings.store';
import { WeaponDefinition } from '@conceptual/definitions/weapon.definition';
import { CheckedService } from './checked.service';

import { playerInfo, simpleSword } from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';

describe('CheckedService', () => {
  const service = new CheckedService();

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRuleTargetOrThrow', () => {
    describe('when target was undefined', () => {
      it('throw Action should not happen', () => {
        expect(() => service.getRuleTargetOrThrow({})).toThrowError(
          GameStringsStore.errorMessages['SHOULD-NOT-HAPPEN']
        );
      });
    });

    describe('when target is defined', () => {
      it('return target', () => {
        expect(
          service.getRuleTargetOrThrow({ target: mockedActorEntity })
        ).toEqual(mockedActorEntity);
      });
    });
  });

  describe('takeItemOrThrow', () => {
    describe('when item was not found', () => {
      it('throw Action should not happen', () => {
        expect(() =>
          service.takeItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was found', () => {
      it('return item', () => {
        when(
          mockedInventoryService.take<WeaponDefinition>(
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenReturn(simpleSword);

        expect(
          service.takeItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).toEqual(simpleSword);
      });
    });
  });

  describe('takeItemOrThrow', () => {
    describe('when item was not found', () => {
      it('throw Action should not happen', () => {
        expect(() =>
          service.lookItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was found', () => {
      it('return item', () => {
        when(
          mockedInventoryService.look<WeaponDefinition>(
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenReturn(simpleSword);

        expect(
          service.lookItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).toEqual(simpleSword);
      });
    });
  });
});
