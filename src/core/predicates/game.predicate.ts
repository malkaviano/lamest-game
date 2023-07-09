import { Observable, Subject } from 'rxjs';

import { MasterRule } from '../../backend/rules/master.rule';
import { SettingsStore } from '../../stores/settings.store';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { PlayerEntity } from '../entities/player.entity';
import { ItemIdentityDefinition } from '../definitions/item-identity.definition';

export class GamePredicate {
  private static readonly logMessageProduced: Subject<LogMessageDefinition> =
    new Subject();

  public static readonly logMessageProduced$: Observable<LogMessageDefinition> =
    this.logMessageProduced.asObservable();

  public static hasEnoughActionPoints(
    actor: ActorInterface,
    rule: MasterRule
  ): boolean {
    const ruleCost = SettingsStore.settings.ruleCost[rule.name];

    const result = actor.derivedAttributes['CURRENT AP'].value >= ruleCost;

    if (!result && actor instanceof PlayerEntity) {
      GamePredicate.logMessageProduced.next(
        GameStringsStore.createInsufficientAPLogMessage(actor.name, ruleCost)
      );
    }

    return result;
  }

  public static canActivate(
    actor: ActorInterface,
    energy: number,
    label: string
  ): boolean {
    const canActivate = actor.derivedAttributes['CURRENT EP'].value >= energy;

    if (!canActivate) {
      const logMessage = GameStringsStore.createNotEnoughEnergyLogMessage(
        actor.name,
        label
      );

      GamePredicate.logMessageProduced.next(logMessage);
    }

    return canActivate;
  }
}
