import { anything, instance, when } from 'ts-mockito';

import { GamePredicate } from '@predicates/game.predicate';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { affectActionable } from '@definitions/actionable.definition';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';

import {
  mockedActorEntity,
  mockedAffectRule,
  mockedPlayerEntity,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  fakeDerivedAttributes,
  greatSword,
  interactiveInfo,
  simpleSword,
} from '../../../tests/fakes';

describe('GamePredicate', () => {
  const rule = instance(mockedAffectRule);

  const eventAttackInteractive = actionableEvent(
    affectActionable,
    interactiveInfo.id
  );

  let predicate: GamePredicate;

  beforeEach(() => {
    setupMocks();

    predicate = new GamePredicate(instance(mockedSkillStore));

    when(
      mockedAffectRule.execute(anything(), anything(), anything())
    ).thenReturn({
      name: 'AFFECT',
      actor: instance(mockedPlayerEntity),
      event: eventAttackInteractive,
      result: 'EXECUTED',
    });
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
        expected: true,
        log: undefined,
        dodge: 20,
        ap: 10,
      },
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: false,
        expected: false,
        log: new LogMessageDefinition(
          'DENIED',
          'Some Name',
          'attack is not avoidable'
        ),
        dodge: 20,
        ap: 10,
      },
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: true,
        expected: false,
        log: new LogMessageDefinition(
          'DENIED',
          'Some Name',
          "Dodge skill couldn't be checked because it's value is zero"
        ),
        dodge: 0,
        ap: 10,
      },
      {
        actor: instance(mockedPlayerEntity),
        actionDodgeable: true,
        expected: false,
        log: new LogMessageDefinition(
          'AP',
          'Some Name',
          'cannot perform Dodge, not enough AP'
        ),
        dodge: 20,
        ap: 0,
      },
    ].forEach(({ actor, actionDodgeable, expected, log, dodge, ap }) => {
      it('return ${expected}', () => {
        when(mockedPlayerEntity.derivedAttributes).thenReturn({
          ...fakeDerivedAttributes,
          ['CURRENT AP']: new DerivedAttributeDefinition('CURRENT AP', ap),
        });

        when(mockedPlayerEntity.skills).thenReturn({ Dodge: dodge });

        const result = predicate.canDodge(actor, actionDodgeable);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        when(mockedPlayerEntity.derivedAttributes).thenReturn({
          ...fakeDerivedAttributes,
          ['CURRENT AP']: new DerivedAttributeDefinition('CURRENT AP', ap),
        });

        when(mockedPlayerEntity.skills).thenReturn({ Dodge: dodge });
        let result: LogMessageDefinition | undefined;

        predicate.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        predicate.canDodge(actor, actionDodgeable);

        done();

        expect(result).toEqual(log);
      });
    });
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
        cooldowns: {},
      },
      {
        actor: instance(mockedPlayerEntity),
        skillName: 'GG',
        expected: false,
        log: new LogMessageDefinition(
          'DENIED',
          'Some Name',
          "GG skill couldn't be checked because it's value is zero"
        ),
        cooldowns: {},
      },
      {
        actor: instance(mockedPlayerEntity),
        skillName: 'First Aid',
        expected: false,
        log: new LogMessageDefinition(
          'COOLDOWN',
          'Some Name',
          'skill First Aid is on cooldown for 2 seconds'
        ),
        cooldowns: { 'First Aid': 2000 },
      },
      {
        actor: instance(mockedPlayerEntity),
        skillName: 'Bargain',
        expected: false,
        log: new LogMessageDefinition(
          'COOLDOWN',
          'Some Name',
          'skill Bargain cannot be used while on aggressive timer'
        ),
        cooldowns: { COMBAT: 1000 },
      },
    ].forEach(({ actor, skillName, expected, log, cooldowns }) => {
      it(`return ${expected}`, () => {
        when(mockedPlayerEntity.cooldowns).thenReturn(
          cooldowns as ReadonlyKeyValueWrapper<number>
        );

        const result = predicate.canUseSkill(actor, skillName);

        expect(result).toEqual(expected);
      });

      it('emit log', (done) => {
        when(mockedPlayerEntity.cooldowns).thenReturn(
          cooldowns as ReadonlyKeyValueWrapper<number>
        );

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
