import { ConsumableDefinition } from '@definitions/consumable.definition';
import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RpgService } from '@services/rpg.service';
import { RuleResult } from '@results/rule.result';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GamePredicate } from '@predicates/game.predicate';

export class ConsumeRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollHelper: RpgService,
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
  ): RuleResult {
    this.ruleResult = {};

    const { eventId } = event;

    const consumable =
      this.checkedService.lookItemOrThrow<ConsumableDefinition>(
        this.inventoryService,
        actor.id,
        eventId
      );

    let ruleResult: RuleResultLiteral = 'DENIED';

    let rollResult: CheckResultLiteral = 'NONE';

    this.ruleResult.skillName = consumable.skillName;

    const canExecute = this.canExecute(actor, consumable.skillName);

    if (canExecute) {
      ruleResult = 'EXECUTED';

      if (consumable.skillName) {
        const checkRoll = this.rollHelper.actorSkillCheck(
          actor,
          consumable.skillName
        );

        rollResult = checkRoll.result;

        this.ruleResult.roll = {
          checkRoll: checkRoll.roll,
          result: rollResult,
        };
      }

      this.consume(actor, consumable, rollResult);
    }

    return this.getResult(event, actor, ruleResult);
  }

  private consume(
    actor: ActorInterface,
    consumable: ConsumableDefinition,
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

    this.ruleResult.consumable = {
      consumed: consumable,
      hp,
      energy,
    };
  }

  private canExecute(actor: ActorInterface, skillName?: string) {
    return !skillName || this.gamePredicate.canUseSkill(actor, skillName);
  }
}
