import { anything, instance, when } from 'ts-mockito';

import { GamePredicate } from './game.predicate';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';

import {
  mockedActorEntity,
  mockedActorEntity2,
  mockedAffectRule,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionAffect,
  actionableEvent,
  interactiveInfo,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

describe('GamePredicate', () => {
  const actor = instance(mockedActorEntity);

  const actor2 = instance(mockedPlayerEntity);

  const rule = instance(mockedAffectRule);

  const eventAttackInteractive = actionableEvent(
    actionAffect,
    interactiveInfo.id
  );

  const log = new LogMessageDefinition(
    'AP',
    'Some Name',
    'insufficient AP. Action requires 3 AP'
  );

  beforeEach(() => {
    setupMocks();

    when(
      mockedAffectRule.execute(anything(), anything(), anything())
    ).thenReturn({
      name: 'AFFECT',
      actor,
      event: eventAttackInteractive,
      result: 'EXECUTED',
    });

    when(mockedPlayerEntity.derivedAttributes).thenReturn({
      'MAX HP': new DerivedAttributeDefinition('MAX HP', 8),
      'MAX EP': new DerivedAttributeDefinition('MAX EP', 13),
      'CURRENT HP': new DerivedAttributeDefinition('CURRENT HP', 8),
      'CURRENT EP': new DerivedAttributeDefinition('CURRENT EP', 13),
      'MAX AP': new DerivedAttributeDefinition('MAX AP', 10),
      'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 0),
    });
  });

  describe('hasEnoughActionPoints', () => {
    [
      {
        expected: true,
        actor,
        log: undefined,
      },
      {
        expected: false,
        actor: actor2,
        log,
      },
    ].forEach(({ expected, actor, log }) => {
      it(`return ${expected}`, () => {
        const result = GamePredicate.hasEnoughActionPoints(actor, rule);

        expect(result).toEqual(expected);
      });

      it('emit log', () => {
        let result: LogMessageDefinition | undefined;

        GamePredicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        GamePredicate.hasEnoughActionPoints(actor, rule);

        expect(result).toEqual(log);
      });
    });
  });
});
