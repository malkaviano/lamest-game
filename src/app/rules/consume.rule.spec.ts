import { TestBed } from '@angular/core/testing';

import { EMPTY } from 'rxjs';
import { deepEqual, instance, when } from 'ts-mockito';

import { GameMessagesStore } from '../stores/game-messages.store';
import { InventoryService } from '../services/inventory.service';
import { ConsumeRule } from './consume.rule';
import { RollService } from '../services/roll.service';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ConsumableDefinition } from '../definitions/consumable.definition';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { AffectAxiomService } from './axioms/affect.axiom.service';

import {
  mockedAffectedAxiomService,
  mockedExtractorHelper,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRollService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionConsume,
  consumableFirstAid,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('ConsumeRule', () => {
  let service: ConsumeRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    when(mockedAffectedAxiomService.logMessageProduced$).thenReturn(EMPTY);

    service = TestBed.inject(ConsumeRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenThrow(new Error(GameMessagesStore.errorMessages['WRONG-ITEM']));

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            actionableEvent(actionConsume, simpleSword.identity.name)
          )
        ).toThrowError(GameMessagesStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a consumable', () => {
      it('should log item consume', (done) => {
        when(
          mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            consumableFirstAid.identity.name
          )
        ).thenReturn(consumableFirstAid);

        when(mockedRollService.actorSkillCheck(actor, 'First Aid')).thenReturn(
          successFirstAidRoll
        );

        when(
          mockedPlayerEntity.reactTo(
            eventConsumeFirstAid.actionableDefinition,
            'SUCCESS',
            deepEqual({
              effect: new EffectEvent(
                consumableFirstAid.effect,
                consumableFirstAid.hp
              ),
              energy: consumableFirstAid.energy,
            })
          )
        ).thenReturn(logHeal5);

        ruleScenario(
          service,
          actor,
          eventConsumeFirstAid,
          {},
          [firstAidLog],
          done
        );
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const successFirstAidRoll = new RollDefinition('SUCCESS', 10);

const firstAidLog = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  'consumed First Aid Kit'
);

const logHeal5 = `${consumableFirstAid.effect}-5`;

const eventConsumeFirstAid = actionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);
