import { anything, instance, when } from 'ts-mockito';

import { GamePredicate } from './game.predicate';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';

import {
  mockedActorEntity,
  mockedAffectRule,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionAffect,
  actionableEvent,
  greatSword,
  interactiveInfo,
  simpleSword,
} from '../../../tests/fakes';

describe('GamePredicate', () => {
  const rule = instance(mockedAffectRule);

  const eventAttackInteractive = actionableEvent(
    actionAffect,
    interactiveInfo.id
  );

  let predicate: GamePredicate;

  beforeEach(() => {
    setupMocks();

    predicate = new GamePredicate();

    when(
      mockedAffectRule.execute(anything(), anything(), anything())
    ).thenReturn({
      name: 'AFFECT',
      actor: instance(mockedPlayerEntity),
      event: eventAttackInteractive,
      result: 'EXECUTED',
    });

    when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);
  });

  describe('hasEnoughActionPoints', () => {
    [
      {
        expected: true,
        actor: instance(mockedActorEntity),
        log: undefined,
      },
      {
        expected: false,
        actor: instance(mockedPlayerEntity),
        log: new LogMessageDefinition(
          'AP',
          'Some Name',
          'insufficient AP. Action requires 3 AP'
        ),
      },
    ].forEach(({ expected, actor, log }) => {
      it(`return ${expected}`, () => {
        setAP();

        const result = predicate.hasEnoughActionPoints(actor, rule);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        setAP();

        let result: LogMessageDefinition | undefined;

        predicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        predicate.hasEnoughActionPoints(actor, rule);

        done();

        expect(result).toEqual(log);
      });
    });
  });

  describe('canDodge', () => {
    [
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: true,
        targetDodgesPerformed: 0,
        expected: true,
        log: undefined,
      },
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: false,
        targetDodgesPerformed: 0,
        expected: false,
        log: new LogMessageDefinition(
          'DENIED',
          'Some Name',
          'attack is not dodgeable'
        ),
      },
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: true,
        targetDodgesPerformed: 2,
        expected: false,
        log: new LogMessageDefinition(
          'DENIED',
          'Some Name',
          'was out of dodges'
        ),
      },
    ].forEach(
      ({ actor, actionDodgeable, targetDodgesPerformed, expected, log }) => {
        it('return ${expected}', () => {
          const result = predicate.canDodge(
            actor,
            actionDodgeable,
            targetDodgesPerformed
          );

          expect(result).toEqual(expected);
        });

        it('emit log', (done) => {
          let result: LogMessageDefinition | undefined;

          predicate.logMessageProduced$.subscribe((event) => {
            result = event;
          });

          predicate.canDodge(actor, actionDodgeable, targetDodgesPerformed);

          done();

          expect(result).toEqual(log);
        });
      }
    );
  });

  describe('canActivate', () => {
    [
      {
        actor: instance(mockedPlayerEntity),
        energy: 2,
        label: 'Weapon',
        expected: true,
        log: undefined,
      },
      {
        actor: instance(mockedPlayerEntity),
        energy: 100,
        label: 'Weapon',
        expected: false,
        log: new LogMessageDefinition(
          'ACTIVATION',
          'Some Name',
          'not enough energy to activate Weapon'
        ),
      },
    ].forEach(({ actor, energy, label, expected, log }) => {
      it(`return ${expected}`, () => {
        const result = predicate.canActivate(actor, energy, label);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        let result: LogMessageDefinition | undefined;

        predicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        predicate.canActivate(actor, energy, label);

        done();

        expect(result).toEqual(log);
      });
    });
  });

  describe('canEquip', () => {
    [
      {
        actor: instance(mockedPlayerEntity),
        equip: simpleSword,
        expected: true,
        log: undefined,
      },
      {
        actor: instance(mockedPlayerEntity),
        equip: greatSword,
        expected: false,
        log: new LogMessageDefinition(
          'EQUIP-ERROR',
          'Some Name',
          'Melee Weapon (Great) is required to equip Great Sword'
        ),
      },
    ].forEach(({ actor, equip, expected, log }) => {
      it(`return ${expected}`, () => {
        const result = predicate.canEquip(actor, equip);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        let result: LogMessageDefinition | undefined;

        predicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        predicate.canEquip(actor, equip);

        done();

        expect(result).toEqual(log);
      });
    });
  });

  describe('canUseSkill', () => {
    [
      {
        actor: instance(mockedPlayerEntity),
        skillName: 'Brawl',
        expected: true,
        log: undefined,
      },
      {
        actor: instance(mockedPlayerEntity),
        skillName: 'GG',
        expected: false,
        log: new LogMessageDefinition(
          'CHECK',
          'Some Name',
          "GG skill couldn't be checked because it's value is zero"
        ),
      },
    ].forEach(({ actor, skillName, expected, log }) => {
      it(`return ${expected}`, () => {
        const result = predicate.canUseSkill(actor, skillName);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        let result: LogMessageDefinition | undefined;

        predicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        predicate.canUseSkill(actor, skillName);

        done();

        expect(result).toEqual(log);
      });
    });
  });
});

const setAP = () => {
  when(mockedPlayerEntity.derivedAttributes).thenReturn({
    'MAX HP': new DerivedAttributeDefinition('MAX HP', 8),
    'MAX EP': new DerivedAttributeDefinition('MAX EP', 13),
    'CURRENT HP': new DerivedAttributeDefinition('CURRENT HP', 8),
    'CURRENT EP': new DerivedAttributeDefinition('CURRENT EP', 13),
    'MAX AP': new DerivedAttributeDefinition('MAX AP', 10),
    'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 0),
  });
};
