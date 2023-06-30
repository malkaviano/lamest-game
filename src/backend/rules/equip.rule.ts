import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { RuleNameLiteral } from '../../core/literals/rule-name.literal';
import { RuleResultLiteral } from '../../core/literals/rule-result.literal';

export class EquipRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
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

    this.ruleResult.skillName = equipped.skillName;

    let ruleResult: RuleResultLiteral = 'DENIED';

    if (actor.skills[equipped.skillName] > 0) {
      ruleResult = 'EXECUTED';

      this.ruleResult.equipped = equipped;

      const weapon = this.checkedService.takeItemOrThrow<WeaponDefinition>(
        this.inventoryService,
        actor.id,
        event.eventId
      );

      const unequipped = actor.equip(weapon);

      if (unequipped) {
        this.ruleResult.unequipped = unequipped;

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
        equipped.skillName,
        equipped.identity.label
      );

      this.ruleLog.next(logMessage);
    }

    return this.getResult(event, actor, ruleResult);
  }
}
