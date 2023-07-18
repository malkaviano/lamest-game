import { ReadableDefinition } from '@definitions/readable.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { InventoryService } from '@services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class ReadRule extends RuleAbstraction {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'READ';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    const itemName = event.eventId;

    const read = this.inventoryService.look<ReadableDefinition>(
      actor.id,
      itemName
    );

    if (!read) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ITEM']);
    }

    const logMessage = GameStringsStore.createItemReadLogMessage(
      actor.name,
      read.identity.label
    );

    this.ruleLog.next(logMessage);

    this.openDocument(read);

    this.ruleResult.read = read;

    return this.getResult(event, actor, 'EXECUTED');
  }

  private openDocument(item: ReadableDefinition): void {
    this.documentOpened.next(item);
  }
}
