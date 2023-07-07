import { Observable } from 'rxjs';

import { ReadAxiom } from '../../core/axioms/read.axiom';
import { ReadableDefinition } from '../../core/definitions/readable.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../../stores/game-strings.store';
import { MasterRule } from './master.rule';
import { ActionableEvent } from '../../core/events/actionable.event';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { RuleNameLiteral } from '../../core/literals/rule-name.literal';
import { DocumentOpenedInterface } from '../../core/interfaces/document-opened.interface';
import { ReadableInterface } from '../../core/interfaces/readable.interface';

export class ReadRule extends MasterRule implements DocumentOpenedInterface {
  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly readAxiomService: ReadAxiom
  ) {
    super();

    this.documentOpened$ = this.readAxiomService.documentOpened$;
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

    this.readAxiomService.openDocument(read);

    this.ruleResult.read = read;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
