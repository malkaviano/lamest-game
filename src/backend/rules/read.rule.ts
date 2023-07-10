import { Observable, Subject } from 'rxjs';

import { ReadableDefinition } from '@definitions/readable.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { DocumentOpenedInterface } from '@interfaces/document-opened.interface';
import { ReadableInterface } from '@interfaces/readable.interface';

export class ReadRule
  extends RuleAbstraction
  implements DocumentOpenedInterface
{
  private readonly documentOpened: Subject<ReadableInterface>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(private readonly inventoryService: InventoryService) {
    super();

    this.documentOpened = new Subject();

    this.documentOpened$ = this.documentOpened.asObservable();
  }

  public override get name(): RuleNameLiteral {
    return 'READ';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
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
    this.documentOpened.next({
      title: item.title,
      text: item.text,
    });
  }
}
