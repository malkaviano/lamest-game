import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { GameMessagesStore } from '../stores/game-messages.store';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CheckedHelper } from './checked.helper';

import { playerInfo, simpleSword } from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';

describe('CheckedHelper', () => {
  let service: CheckedHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    setupMocks();

    service = TestBed.inject(CheckedHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRuleTargetOrThrow', () => {
    describe('when target was undefined', () => {
      it('throw Action should not happen', () => {
        expect(() => service.getRuleTargetOrThrow({})).toThrowError(
          GameMessagesStore.errorMessages['SHOULD-NOT-HAPPEN']
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
        ).toThrowError(GameMessagesStore.errorMessages['WRONG-ITEM']);
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
        ).toThrowError(GameMessagesStore.errorMessages['WRONG-ITEM']);
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
