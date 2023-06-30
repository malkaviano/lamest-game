import { instance, verify, when } from 'ts-mockito';

import { VisibilityPolicy } from './visibility.policy';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionAffect, actionableEvent } from '../../../tests/fakes';

describe('VisibilityPolicy', () => {
  const policy = new VisibilityPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  const eventAffect = actionableEvent(actionAffect, target.id);

  beforeEach(() => {
    setupMocks();
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('actor visibility', () => {
    describe('when using affect', () => {
      it('change visibility to VISIBLE', () => {
        const ruleResult: RuleResultInterface = {
          name: 'AFFECT',
          actor,
          event: eventAffect,
          target,
          result: 'EXECUTED',
        };

        when(mockedPlayerEntity.visibility).thenReturn('DISGUISED');

        const result = policy.enforce(ruleResult);

        verify(mockedPlayerEntity.changeVisibility('VISIBLE')).once();

        verify(mockedActorEntity.changeVisibility('VISIBLE')).never();

        expect(result).toEqual({
          visibility: { actor: 'VISIBLE' },
        });
      });
    });
  });

  describe('target visibility', () => {
    describe('when affected', () => {
      it('change visibility to VISIBLE', () => {
        const ruleResult: RuleResultInterface = {
          name: 'AFFECT',
          actor,
          event: eventAffect,
          target,
          result: 'EXECUTED',
          effect: {
            amount: 10,
            type: 'ACID',
          },
        };

        when(mockedPlayerEntity.visibility).thenReturn('VISIBLE');

        when(mockedActorEntity.visibility).thenReturn('HIDDEN');

        const result = policy.enforce(ruleResult);

        verify(mockedPlayerEntity.changeVisibility('VISIBLE')).never();

        verify(mockedActorEntity.changeVisibility('VISIBLE')).once();

        expect(result).toEqual({
          visibility: { target: 'VISIBLE' },
        });
      });
    });
  });

  it('should log', (done) => {
    const result: LogMessageDefinition[] = [];

    const ruleResult: RuleResultInterface = {
      name: 'AFFECT',
      actor,
      event: eventAffect,
      target,
      result: 'EXECUTED',
      effect: {
        amount: 10,
        type: 'ACID',
      },
    };

    when(mockedPlayerEntity.visibility).thenReturn('DISGUISED');

    when(mockedActorEntity.visibility).thenReturn('HIDDEN');

    policy.logMessageProduced$.subscribe((event) => {
      result.push(event);
    });

    policy.enforce(ruleResult);

    done();

    expect(result).toEqual([
      new LogMessageDefinition(
        'VISIBILITY',
        actor.name,
        'visibility changed to VISIBLE'
      ),
      new LogMessageDefinition(
        'VISIBILITY',
        target.name,
        'visibility changed to VISIBLE'
      ),
    ]);
  });

  it('should not log', (done) => {
    const result: LogMessageDefinition[] = [];

    const ruleResult: RuleResultInterface = {
      name: 'AFFECT',
      actor,
      event: eventAffect,
      target,
      result: 'EXECUTED',
      effect: {
        amount: 10,
        type: 'ACID',
      },
    };

    when(mockedPlayerEntity.visibility).thenReturn('VISIBLE');

    when(mockedActorEntity.visibility).thenReturn('VISIBLE');

    policy.logMessageProduced$.subscribe((event) => {
      result.push(event);
    });

    policy.enforce(ruleResult);

    done();

    expect(result).toEqual([]);
  });
});
