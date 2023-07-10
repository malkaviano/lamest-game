import { instance, when } from 'ts-mockito';

import { ReadRule } from './read.rule';
import { GameStringsStore } from '@stores/game-strings.store';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionRead,
  playerInfo,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';
import { ReadableInterface } from '@interfaces/readable.interface';

describe('ReadRule', () => {
  let rule: ReadRule;

  beforeEach(() => {
    setupMocks();

    rule = new ReadRule(instance(mockedInventoryService));

    when(
      mockedInventoryService.look(playerInfo.id, eventRead.eventId)
    ).thenReturn(readable);

    when(
      mockedInventoryService.look(playerInfo.id, eventReadWrong.eventId)
    ).thenReturn(null);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('throw Wrong item was used', () => {
        expect(() =>
          rule.execute(instance(mockedPlayerEntity), eventReadWrong)
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('item was found', () => {
      it('should log item was read', (done) => {
        ruleScenario(rule, actor, eventRead, {}, [itemReadLog], done);
      });

      it('return read result', () => {
        const result = rule.execute(actor, eventRead);

        const expected: RuleResultInterface = {
          name: 'READ',
          event: eventRead,
          actor,
          read: readable,
          result: 'EXECUTED',
        };

        expect(result).toEqual(expected);
      });
    });

    describe('openDocument', () => {
      it('should emit documentOpened event', (done) => {
        const result: ReadableInterface[] = [];

        rule.documentOpened$.subscribe((event) => {
          result.push(event);
        });

        rule.execute(actor, eventRead);

        done();

        expect(result).toEqual([docEvent]);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventRead = actionableEvent(actionRead, readable.identity.name);

const eventReadWrong = actionableEvent(actionRead, simpleSword.identity.name);

const itemReadLog = new LogMessageDefinition(
  'READ',
  playerInfo.name,
  'read Book'
);

const docEvent = {
  title: readable.title,
  text: readable.text,
};
