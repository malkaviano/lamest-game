import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class EquipRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): string {
    return 'EQUIP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const equipped = this.checkedService.lookItemOrThrow<WeaponDefinition>(
      this.inventoryService,
      actor.id,
      event.eventId
    );

    const skillName = equipped.skillName;

    const result: RuleResultInterface = {
      name: 'EQUIP',
      event,
      actor,
      result: 'DENIED',
      skill: {
        name: skillName,
      },
    };

    if (actor.skills[skillName] > 0) {
      Object.assign(result, { result: 'EXECUTED', equipped });

      const weapon = this.checkedService.takeItemOrThrow<WeaponDefinition>(
        this.inventoryService,
        actor.id,
        event.eventId
      );

      const unequipped = actor.equip(weapon);

      if (unequipped) {
        Object.assign(result, { unequipped });

        this.inventoryService.store(actor.id, unequipped);

        const logMessage = GameStringsStore.createUnEquippedLogMessage(
          actor.name,
          unequipped.identity.label
        );

        this.ruleLog.next(logMessage);
      }

      const logMessage = GameStringsStore.createEquippedLogMessage(
        actor.name,
        weapon.identity.label
      );

      this.ruleLog.next(logMessage);
    } else {
      const logMessage = GameStringsStore.createEquipErrorLogMessage(
        actor.name,
        skillName,
        equipped.identity.label
      );

      this.ruleLog.next(logMessage);
    }

    return result;
  }
}
