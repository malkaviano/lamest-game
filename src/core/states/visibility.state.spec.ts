import { instance } from 'ts-mockito';

import { VisibilityState } from './visibility.state';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { RuleResultLiteral } from '../literals/rule-result.literal';
import { emptyState } from './empty.state';
import { GameStringsStore } from '../../stores/game-strings.store';

import {
  actionAsk,
  actionDetect,
  actionDisguise,
  actionHide,
  actorSettings,
  fakeCharacteristics,
  fakeIdentity,
} from '../../../tests/fakes';
import {
  mockedCooldownBehavior,
  mockedPlayerEntity,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import { PlayerEntity } from '../entities/player.entity';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { CheckResultLiteral } from '../literals/check-result.literal';

const fakeState = (action: ActionableDefinition, tries: number) =>
  new VisibilityState(action, tries);

describe('VisibilityState', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('when actorVisibility was not defined', () => {
    [
      {
        action: actionDisguise,
      },
      {
        action: actionHide,
      },
    ].forEach(({ action }) => {
      describe(`when action was ${action}`, () => {
        it('throw Invalid operation ocurred', () => {
          expect(() =>
            fakeState(action, 1).onResult(action, 'SUCCESS', {
              target: instance(mockedPlayerEntity),
            })
          ).toThrowError(GameStringsStore.errorMessages['INVALID-OPERATION']);
        });
      });
    });
  });

  describe('when target was not defined', () => {
    [
      {
        action: actionDetect,
      },
    ].forEach(({ action }) => {
      describe(`when action was ${action}`, () => {
        it('throw Invalid operation ocurred', () => {
          expect(() =>
            fakeState(action, 1).onResult(action, 'SUCCESS', {
              actor: instance(mockedPlayerEntity),
            })
          ).toThrowError(GameStringsStore.errorMessages['INVALID-OPERATION']);
        });
      });
    });
  });

  describe('when actorVisibility was defined', () => {
    [
      {
        visibility: 'DISGUISED',
        action: actionDisguise,
        rollResult: 'SUCCESS',
        expected: { state: emptyState },
        tries: 2,
      },
      {
        visibility: 'HIDDEN',
        action: actionHide,
        rollResult: 'SUCCESS',
        expected: { state: emptyState },
        tries: 2,
      },
      {
        visibility: 'VISIBLE',
        action: actionAsk,
        rollResult: 'SUCCESS',
        expected: { state: emptyState },
        tries: 2,
      },
      {
        visibility: 'VISIBLE',
        action: actionHide,
        rollResult: 'FAILURE',
        expected: { state: fakeState(actionHide, 1) },
        tries: 2,
      },
      {
        visibility: 'VISIBLE',
        action: actionDisguise,
        rollResult: 'FAILURE',
        expected: { state: emptyState },
        tries: 1,
      },
      {
        visibility: 'VISIBLE',
        action: actionDisguise,
        rollResult: 'NONE',
        expected: { state: fakeState(actionDisguise, 1) },
        tries: 1,
      },
    ].forEach(({ action, visibility, rollResult, expected, tries }) => {
      it('return state', () => {
        const char = fakeCharacter();

        const result = fakeState(action, tries).onResult(
          action,
          rollResult as CheckResultLiteral,
          {
            actor: char,
          }
        );

        expect(result).toEqual(expected);
      });

      it('should set actor visibility', () => {
        const char = fakeCharacter();

        fakeState(action, tries).onResult(
          action,
          rollResult as CheckResultLiteral,
          {
            actor: char,
            target: char,
          }
        );

        expect(char.visibility).toEqual(visibility);
      });
    });
  });

  describe('when target was defined', () => {
    [
      {
        visibility: 'VISIBLE',
        action: actionDetect,
        rollResult: 'SUCCESS',
        expected: { state: emptyState },
        tries: 2,
      },
      {
        visibility: 'HIDDEN',
        action: actionDetect,
        rollResult: 'FAILURE',
        expected: { state: emptyState },
        tries: 1,
      },
    ].forEach(({ action, visibility, rollResult, expected, tries }) => {
      it('return state', () => {
        const char = fakeCharacter();

        const result = fakeState(action, tries).onResult(
          action,
          rollResult as CheckResultLiteral,
          {
            actor: char,
            target: char,
          }
        );

        expect(result).toEqual(expected);
      });

      it('should set target visibility', () => {
        const char = fakeCharacter();

        char.changeVisibility('HIDDEN');

        fakeState(action, tries).onResult(
          action,
          rollResult as CheckResultLiteral,
          {
            actor: char,
            target: char,
          }
        );

        expect(char.visibility).toEqual(visibility);
      });
    });
  });
});

const distributedSkills = new Map<string, number>([
  ['Firearm (Handgun)', 35],
  ['First Aid', 35],
  ['Manipulation', 35],
  ['Detect', 35],
  ['Research', 35],
  ['Drive (Automobile)', 35],
  ['Firearm (Shooter)', 35],
  ['Brawl', 35],
  ['Dodge', 35],
  ['Athleticism', 5],
  ['Bargain', 5],
  ['Disguise', 5],
  ['Streetwise', 5],
  ['Hide', 5],
  ['Melee Weapon (Simple)', 5],
  ['Ranged Weapon (Throw)', 5],
  ['Performance', 5],
  ['Sleight of Hand', 5],
  ['Survival', 5],
]);

const fakeCharacter = () =>
  new PlayerEntity(
    fakeIdentity,
    ActorBehavior.create(
      fakeCharacteristics,
      distributedSkills,
      instance(mockedSkillStore),
      actorSettings
    ),
    EquipmentBehavior.create(),
    instance(mockedCooldownBehavior)
  );
