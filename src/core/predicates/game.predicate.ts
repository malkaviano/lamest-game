import { Observable, Subject } from 'rxjs';

import { MasterRule } from '../../backend/rules/master.rule';
import { SettingsStore } from '../../stores/settings.store';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { PlayerEntity } from '../entities/player.entity';
import { LoggerInterface } from '../interfaces/logger.interface';

export class GamePredicate implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition> =
    new Subject();

  public readonly logMessageProduced$: Observable<LogMessageDefinition> =
    this.logMessageProduced.asObservable();

  public hasEnoughActionPoints(
    actor: ActorInterface,
    rule: MasterRule
  ): boolean {
    const ruleCost = SettingsStore.settings.ruleCost[rule.name];

    const result = actor.derivedAttributes['CURRENT AP'].value >= ruleCost;

    if (!result && actor instanceof PlayerEntity) {
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

    if (!canActivate) {
      const logMessage = GameStringsStore.createNotEnoughEnergyLogMessage(
        actor.name,
        label
      );

      this.logMessageProduced.next(logMessage);
    }

    return canActivate;
  }
}
