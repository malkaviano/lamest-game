import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../../core/definitions/consumable.definition';
import { InventoryService } from '../services/inventory.service';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { MasterRuleService } from './master.rule';
import { ResultLiteral } from '../../core/literals/result.literal';
import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiom } from '../axioms/affect.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';
import { CheckedService } from '../services/checked.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollRule: RollService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiom: AffectAxiom
  ) {
    super();
  }

  public execute(actor: ActorInterface, event: ActionableEvent): void {
    const { actionableDefinition, eventId } = event;

    const consumable =
      this.checkedService.lookItemOrThrow<ConsumableDefinition>(
        this.inventoryService,
        actor.id,
        eventId
      );

    let rollResult: ResultLiteral = 'NONE';

    if (consumable.skillName) {
      rollResult = this.rollRule.actorSkillCheck(
        actor,
        consumable.skillName
      ).result;
    }

    if (rollResult !== 'IMPOSSIBLE') {
      this.consume(actor, consumable, actionableDefinition, rollResult);

      if (consumable.usability === 'DISPOSABLE') {
        this.checkedService.takeItemOrThrow<ConsumableDefinition>(
          this.inventoryService,
          actor.id,
          eventId
        );

        const logMessage = GameStringsStore.createLostItemLogMessage(
          actor.name,
          consumable.identity.label
        );

        this.ruleLog.next(logMessage);
      }
    }
  }

  private consume(
    actor: ActorInterface,
    consumable: ConsumableDefinition,
    actionableDefinition: ActionableDefinition,
    rollResult: ResultLiteral
  ) {
    const logMessage = GameStringsStore.createConsumedLogMessage(
      actor.name,
      consumable.identity.label
    );

    this.ruleLog.next(logMessage);

    const hp =
      rollResult === 'FAILURE' ? Math.trunc(consumable.hp / 2) : consumable.hp;

    const energy =
      rollResult === 'FAILURE'
        ? Math.trunc(consumable.energy / 2)
        : consumable.energy;

    this.affectAxiom.affectWith(actor, actionableDefinition, rollResult, {
      effect: new EffectEvent(consumable.effect, hp),
      energy,
    });
  }
}
