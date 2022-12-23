import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { GameMessagesStore } from '../stores/game-messages.store';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ExtractorHelper } from './extractor.helper';

import { playerInfo, simpleSword } from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';

describe('ExtractorHelper', () => {
  let service: ExtractorHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    setupMocks();

    service = TestBed.inject(ExtractorHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('extractRuleTarget', () => {
    describe('when target was undefined', () => {
      it('throw Action should not happen', () => {
        expect(() => service.extractRuleTargetOrThrow({})).toThrowError(
          GameMessagesStore.errorMessages['SHOULD-NOT-HAPPEN']
        );
      });
    });

    describe('when target is defined', () => {
      it('return target', () => {
        expect(
          service.extractRuleTargetOrThrow({ target: mockedActorEntity })
        ).toEqual(mockedActorEntity);
      });
    });
  });

  describe('extractItemOrThrow', () => {
    describe('when item was not found', () => {
      it('throw Action should not happen', () => {
        expect(() =>
          service.extractItemOrThrow<WeaponDefinition>(
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
          service.extractItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).toEqual(simpleSword);
      });
    });
  });
});
