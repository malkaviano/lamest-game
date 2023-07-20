import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GamePredicate } from '@predicates/game.predicate';

export class EquipRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly gamePredicate: GamePredicate
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'EQUIP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    this.ruleResult = {};

    const toEquip = this.checkedService.lookItemOrThrow<WeaponDefinition>(
      this.inventoryService,
      actor.id,
      event.eventId
    );

    this.ruleResult.skillName = toEquip.skillName;

    let ruleResult: RuleResultLiteral = 'DENIED';

    if (this.gamePredicate.canEquip(actor, toEquip)) {
      ruleResult = 'EXECUTED';

      this.ruleResult.equipped = toEquip;

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
    }

    return this.getResult(event, actor, ruleResult);
  }
}
