import { ConsumableDefinition } from '@definitions/consumable.definition';
import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { EffectEvent } from '@events/effect.event';
import { CheckedService } from '@services/checked.service';
import { RollHelper } from '@helpers/roll.helper';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GamePredicate } from '@predicates/game.predicate';

export class ConsumeRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly gamePredicate: GamePredicate
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

    this.ruleResult.skillName = consumed.skillName;

    const canExecute = this.canExecute(actor, consumed.skillName);

    if (canExecute) {
      if (consumed.skillName) {
        const checkRoll = this.rollHelper.actorSkillCheck(
          actor,
          consumed.skillName
        );

        rollResult = checkRoll.result;

        this.ruleResult.roll = {
          checkRoll: checkRoll.roll,
          result: rollResult,
        };
      }

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

    this.affectWith(actor, actionableDefinition, rollResult, {
      effect: new EffectEvent(consumable.effect, hp),
      energy,
    });

    this.ruleResult.consumableHp = hp;

    this.ruleResult.consumableEnergy = energy;
  }

  private canExecute(actor: ActorInterface, skillName?: string) {
    return !skillName || this.gamePredicate.canUseSkill(actor, skillName);
  }
}
