import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { CheckedService } from '@services/checked.service';
import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';

export class DisposePolicy extends PolicyAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override enforce(result: RuleResultInterface): PolicyResultInterface {
    if (result.result !== 'DENIED') {
      if (
        result.name === 'AFFECT' &&
        result.actor.weaponEquipped.usability === 'DISPOSABLE'
      ) {
        const disposed = result.actor.unEquip();

        if (disposed) {
          const logMessage = GameStringsStore.createLostItemLogMessage(
            result.actor.name,
            disposed.identity.label
          );

          this.logMessageProduced.next(logMessage);

          return {
            disposed,
          };
        }
      } else {
        const disposed =
          result.consumable?.consumed ?? result.used ?? result.dropped;

        if (disposed?.usability === 'DISPOSABLE') {
          return this.dispose(result.actor, disposed.identity.name);
        }
      }
    }

    return {};
  }

  private dispose(actor: ActorInterface, name: string) {
    const disposed = this.checkedService.takeItemOrThrow(
      this.inventoryService,
      actor.id,
      name
    );

    const logMessage = GameStringsStore.createLostItemLogMessage(
      actor.name,
      disposed.identity.label
    );

    this.logMessageProduced.next(logMessage);

    return {
      disposed,
    };
  }
}
