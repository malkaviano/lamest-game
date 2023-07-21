import { UsableDefinition } from '@definitions/usable.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValues } from '@values/rule.value';
import { InventoryService } from '@services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RollService } from '@services/roll.service';

export class UseRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly rollService: RollService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'USE';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValues
  ): RuleResult {
    this.ruleResult = {};

    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const used = this.inventoryService.look<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    let ruleResult: RuleResultLiteral = 'DENIED';

    this.ruleResult.target = target;

    if (!used) {
      const logMessage = GameStringsStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    } else {
      this.ruleResult.used = used;

      const skillName = used.skillName;

      this.ruleResult.skillName = skillName;

      if (skillName) {
        const { result, roll } = this.rollService.actorSkillCheck(
          actor,
          skillName
        );

        this.ruleResult.roll = {
          checkRoll: roll,
          result,
        };
      }

      ruleResult =
        this.ruleResult.roll?.result !== 'FAILURE' ? 'EXECUTED' : 'AVOIDED';
    }

    return this.getResult(event, actor, ruleResult);
  }
}
