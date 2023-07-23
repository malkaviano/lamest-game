import { Observable, Subject } from 'rxjs';

import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { SettingsStore } from '@stores/settings.store';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { PlayerEntity } from '@entities/player.entity';
import { LoggerInterface } from '@interfaces/logger.interface';
import { WeaponDefinition } from '@definitions/weapon.definition';

export class GamePredicate implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition> =
    new Subject();

  public readonly logMessageProduced$: Observable<LogMessageDefinition> =
    this.logMessageProduced.asObservable();

  public hasEnoughActionPoints(
    actor: ActorInterface,
    rule: RuleAbstraction
  ): boolean {
    const ruleCost = SettingsStore.settings.ruleCost[rule.name];

    const result = actor.derivedAttributes['CURRENT AP'].value >= ruleCost;

    if (!result && this.isPlayer(actor)) {
      this.logMessageProduced.next(
        GameStringsStore.createInsufficientAPLogMessage(actor.name, ruleCost)
      );
    }

    return result;
  }

  public canActivate(
    actor: ActorInterface,
    energy: number,
    label: string
  ): boolean {
    const canActivate = actor.derivedAttributes['CURRENT EP'].value >= energy;

    if (!canActivate && this.isPlayer(actor)) {
      const logMessage = GameStringsStore.createNotEnoughEnergyLogMessage(
        actor.name,
        label
      );

      this.logMessageProduced.next(logMessage);
    }

    return canActivate;
  }

  public canDodge(actor: ActorInterface, actionDodgeable: boolean): boolean {
    if (
      actor.derivedAttributes['CURRENT AP'].value >=
      SettingsStore.settings.dodgeAPCost
    ) {
      if (
        this.canUseSkill(actor, SettingsStore.settings.systemSkills.dodgeSkill)
      ) {
        if (!actionDodgeable && this.isPlayer(actor)) {
          const logMessage = GameStringsStore.createUnDodgeableAttackLogMessage(
            actor.name
          );

          this.logMessageProduced.next(logMessage);
        }

        return actionDodgeable;
      }
    } else {
      const logMessage = GameStringsStore.createCannotDodgeAPLogMessage(
        actor.name,
        SettingsStore.settings.systemSkills.dodgeSkill
      );

      this.logMessageProduced.next(logMessage);
    }

    return false;
  }

  public canEquip(actor: ActorInterface, equip: WeaponDefinition): boolean {
    const canEquip = actor.skills[equip.skillName] > 0;

    if (!canEquip) {
      const logMessage = GameStringsStore.createEquipErrorLogMessage(
        actor.name,
        equip.skillName,
        equip.identity.label
      );

      this.logMessageProduced.next(logMessage);
    }

    return canEquip;
  }

  public canUseSkill(actor: ActorInterface, skillName: string): boolean {
    const isPlayer = this.isPlayer(actor);

    const skillCooldown = (actor as PlayerEntity).cooldowns[skillName];

    if (skillCooldown) {
      const logMessage = GameStringsStore.createSkillOnCooldownLogMessage(
        actor.name,
        skillName,
        Math.ceil(skillCooldown / 1000)
      );

      this.logMessageProduced.next(logMessage);
    }

    const canUseSkill = (actor.skills[skillName] ?? 0) > 0;

    if (!canUseSkill && isPlayer) {
      const logMessage = GameStringsStore.createCannotCheckSkillLogMessage(
        actor.name,
        skillName
      );

      this.logMessageProduced.next(logMessage);
    }

    return canUseSkill && !skillCooldown;
  }

  private isPlayer(actor: ActorInterface) {
    return actor instanceof PlayerEntity;
  }
}
