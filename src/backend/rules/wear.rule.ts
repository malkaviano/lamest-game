import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { ArmorDefinition } from '@definitions/armor.definition';
import { RuleResult } from '@results/rule.result';

export class WearRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'WEAR';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    const toWear = this.checkedService.takeItemOrThrow<ArmorDefinition>(
      this.inventoryService,
      actor.id,
      event.eventId
    );

    this.ruleResult.wearing = toWear;

    const strip = actor.wear(toWear);

    if (strip) {
      this.ruleResult.strip = strip;

      this.inventoryService.store(actor.id, strip);

      const logMessage = GameStringsStore.createStripLogMessage(
        actor.name,
        strip.identity.label
      );

      this.ruleLog.next(logMessage);
    }

    const logMessage = GameStringsStore.createWearingLogMessage(
      actor.name,
      toWear.identity.label
    );

    this.ruleLog.next(logMessage);

    return this.getResult(event, actor, 'EXECUTED');
  }
}
