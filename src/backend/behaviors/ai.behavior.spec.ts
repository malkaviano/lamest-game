import { when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';
import { AiBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { AiBehavior } from './ai.behavior';
import { ArrayView } from '../view-models/array.view';

import { playerInfo } from '../../../tests/fakes';
import { mockedCooldownBehavior, setupMocks } from '../../../tests/mocks';

describe('AiBehavior', () => {
  beforeEach(() => {
    setupMocks();
  });

  const event = new ActionableEvent(
    createActionableDefinition('AFFECT', 'affect', 'Use Equipped'),
    playerInfo.id
  );

  [
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'PASSIVE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'RETALIATE' as AiBehaviorLiteral,
      afflictedBy: [],
      expected: null,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'RETALIATE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'DEAD' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
    {
      playerActorInfo: {
        id: playerInfo.id,
        classification: 'PLAYER' as ClassificationLiteral,
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'HIDDEN' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as AiBehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
  ].forEach(({ playerActorInfo, behavior, afflictedBy, expected }) => {
    describe(`when ${behavior} and was attacked ${afflictedBy}`, () => {
      scenario(playerActorInfo, behavior, afflictedBy, expected);
    });
  });
});

const behavior = (aiBehavior: AiBehaviorLiteral) =>
  AiBehavior.create(aiBehavior, ArrayView.create(['HIDDEN']));

function scenario(
  playerActorInfo: {
    id: string;
    classification: ClassificationLiteral;
    situation: ActorSituationLiteral;
    visibility: VisibilityLiteral;
  },
  aiBehavior: AiBehaviorLiteral,
  afflictedBy: string[],
  expected: ActionableEvent | null
) {
  it(`return ${expected?.actionableDefinition.actionable}`, () => {
    const b = behavior(aiBehavior);

    when(mockedCooldownBehavior.canAct).thenReturn(true);

    expect(b.action(ArrayView.create([playerActorInfo]), afflictedBy)).toEqual(
      expected
    );
  });
}
