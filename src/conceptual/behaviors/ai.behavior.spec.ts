import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';
import { BehaviorLiteral } from '../literals/behavior.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { AiBehavior } from './ai.behavior';
import { ArrayView } from '../view-models/array.view';
import { ActionableEvent } from '../events/actionable.event';

import { actionAffect, playerInfo } from '../../../tests/fakes';
import { setupMocks } from '../../../tests/mocks';

describe('AiBehavior', () => {
  beforeEach(() => {
    setupMocks();
  });

  const event = new ActionableEvent(actionAffect, playerInfo.id);

  [
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'PASSIVE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'RETALIATE' as BehaviorLiteral,
      afflictedBy: [],
      expected: null,
    },
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'RETALIATE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: event,
    },
    {
      playerActorInfo: {
        situation: 'DEAD' as ActorSituationLiteral,
        visibility: 'VISIBLE' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
    {
      playerActorInfo: {
        situation: 'ALIVE' as ActorSituationLiteral,
        visibility: 'HIDDEN' as VisibilityLiteral,
      },
      behavior: 'AGGRESSIVE' as BehaviorLiteral,
      afflictedBy: [playerInfo.id],
      expected: null,
    },
  ].forEach(({ playerActorInfo, behavior, afflictedBy, expected }) => {
    describe(`when ${behavior} and was attacked ${afflictedBy}`, () => {
      const id = playerInfo.id;
      const classification: ClassificationLiteral = 'PLAYER';

      scenario(
        {
          id,
          classification,
          ...playerActorInfo,
        },
        behavior,
        afflictedBy,
        expected
      );
    });
  });
});

const behavior = (aiBehavior: BehaviorLiteral) =>
  AiBehavior.create(aiBehavior, ArrayView.create('HIDDEN'));

function scenario(
  playerActorInfo: {
    id: string;
    classification: ClassificationLiteral;
    situation: ActorSituationLiteral;
    visibility: VisibilityLiteral;
  },
  aiBehavior: BehaviorLiteral,
  afflictedBy: string[],
  expected: ActionableEvent | null
) {
  it(`return ${expected?.actionableDefinition.actionable}`, () => {
    const b = behavior(aiBehavior);

    expect(b.action(ArrayView.create(playerActorInfo), afflictedBy)).toEqual(
      expected
    );
  });
}
