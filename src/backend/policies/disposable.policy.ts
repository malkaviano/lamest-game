import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { CheckedService } from '@services/checked.service';
import { InventoryService } from '@services/inventory.service';
import { ConsumableDefinition } from '@definitions/consumable.definition';

export class DisposablePolicy extends PolicyAbstraction {
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
      }

      if (
        result.name === 'CONSUME' &&
        result.consumable?.consumed.usability === 'DISPOSABLE'
      ) {
        const consumed =
          this.checkedService.takeItemOrThrow<ConsumableDefinition>(
            this.inventoryService,
            result.actor.id,
            result.consumable.consumed.identity.name
          );

        const logMessage = GameStringsStore.createLostItemLogMessage(
          result.actor.name,
          consumed.identity.label
        );

        this.logMessageProduced.next(logMessage);

        return {
          consumed,
        };
      }
    }

    return {};
  }
}
