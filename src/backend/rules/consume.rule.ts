import { ConsumableDefinition } from '@conceptual/definitions/consumable.definition';
import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '@conceptual/interfaces/actor.interface';
import { MasterRule } from './master.rule';
import { ActionableDefinition } from '@conceptual/definitions/actionable.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiom } from '@conceptual/axioms/affect.axiom';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { EffectEvent } from '@conceptual/events/effect.event';
import { CheckedService } from '../services/checked.service';
import { RollHelper } from '@conceptual/helpers/roll.helper';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { CheckResultLiteral } from '@conceptual/literals/check-result.literal';
import { RuleNameLiteral } from '@conceptual/literals/rule-name.literal';
import { RuleResultLiteral } from '@conceptual/literals/rule-result.literal';

export class ConsumeRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly affectAxiom: AffectAxiom
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'CONSUME';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const { actionableDefinition, eventId } = event;

    const consumed = this.checkedService.lookItemOrThrow<ConsumableDefinition>(
      this.inventoryService,
      actor.id,
      eventId
    );

    let ruleResult: RuleResultLiteral = 'DENIED';

    let rollResult: CheckResultLiteral = 'NONE';

    this.ruleResult.consumable = consumed;

    if (consumed.skillName) {
      const checkRoll = this.rollHelper.actorSkillCheck(
        actor,
        consumed.skillName
      );

      rollResult = checkRoll.result;

      this.ruleResult.skillName = consumed.skillName;

      this.ruleResult.checkRoll = checkRoll.roll;
    }

    if (rollResult !== 'IMPOSSIBLE') {
      this.consume(actor, consumed, actionableDefinition, rollResult);

      ruleResult = 'EXECUTED';

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

    return this.getResult(event, actor, ruleResult);
  }

  private consume(
    actor: ActorInterface,
    consumable: ConsumableDefinition,
    actionableDefinition: ActionableDefinition,
    rollResult: CheckResultLiteral
  ): void {
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

    this.ruleResult.consumableHp = hp;

    this.ruleResult.consumableEnergy = energy;
  }
}
