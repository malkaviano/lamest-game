import { ConsumableDefinition } from '../../core/definitions/consumable.definition';
import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { MasterRule } from './master.rule';
import { ResultLiteral } from '../../core/literals/result.literal';
import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';
import { CheckedService } from '../services/checked.service';
import { RollHelper } from '../../core/helpers/roll.helper';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class ConsumeRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly affectAxiom: AffectAxiom
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const { actionableDefinition, eventId } = event;

    const consumed = this.checkedService.lookItemOrThrow<ConsumableDefinition>(
      this.inventoryService,
      actor.id,
      eventId
    );

    let rollResult: ResultLiteral = 'NONE';

    const result: RuleResultInterface = {
      event,
      actor,
      result: 'DENIED',
    };

    if (consumed.skillName) {
      const rollChecked = this.rollHelper.actorSkillCheck(
        actor,
        consumed.skillName
      );

      rollResult = rollChecked.result;

      Object.assign(result, {
        skill: { name: consumed.skillName, roll: rollChecked.roll },
      });
    }

    if (rollResult !== 'IMPOSSIBLE') {
      const { hp, energy } = this.consume(
        actor,
        consumed,
        actionableDefinition,
        rollResult
      );

      Object.assign(result, {
        result: 'CONSUMED',
        consumable: {
          consumed,
          hp,
          energy,
        },
      });

      this.checkedService.takeItemOrThrow<ConsumableDefinition>(
        this.inventoryService,
        actor.id,
        eventId
      );

      const logMessage = GameStringsStore.createLostItemLogMessage(
        actor.name,
        consumed.identity.label
      );

      this.ruleLog.next(logMessage);
    }

    return result;
  }

  private consume(
    actor: ActorInterface,
    consumable: ConsumableDefinition,
    actionableDefinition: ActionableDefinition,
    rollResult: ResultLiteral
  ): { hp: number; energy: number } {
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

    return { hp, energy };
  }
}
