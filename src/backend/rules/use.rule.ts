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
import { RpgService } from '@services/rpg.service';

export class UseRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly rollService: RpgService
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

    const { actionableDefinition } = event;

    const used = this.inventoryService.look<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    let ruleResult: RuleResultLiteral = 'DENIED';

    // Determine target semantics
    let target = extras.target;
    const skillName = used?.skillName;
    if (!target && skillName) {
      target = actor;
    }

    this.ruleResult.target = target;

    if (!used) {
      const logMessage = GameStringsStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    } else {
      this.ruleResult.used = used;

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
        ruleResult =
          this.ruleResult.roll?.result !== 'FAILURE' ? 'EXECUTED' : 'AVOIDED';
      } else {
        // Items without skill require an explicit target (e.g., keys on containers)
        ruleResult = target ? 'EXECUTED' : 'DENIED';
      }
    }

    return this.getResult(event, actor, ruleResult);
  }
}
