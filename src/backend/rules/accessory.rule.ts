import { UsableDefinition } from '@definitions/usable.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { InventoryService } from '@services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RpgService } from '@services/rpg.service';

export class AccessoryRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollService: RpgService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'ACCESSORY';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    this.ruleResult = {};

    const { actionableDefinition } = event;

    const used = this.inventoryService.look<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    let ruleResult: RuleResultLiteral = 'DENIED';

    // Accessory always applies to the player (self-target)
    this.ruleResult.target = actor;
    const skillName = used?.skillName;

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
        // No skill: accessory use on self succeeds
        ruleResult = 'EXECUTED';
      }
    }

    return this.getResult(event, actor, ruleResult);
  }
}
