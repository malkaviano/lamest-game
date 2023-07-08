import { Observable, Subject } from 'rxjs';

import { MasterRule } from '../../backend/rules/master.rule';
import { SettingsStore } from '../../stores/settings.store';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { GameStringsStore } from '../../stores/game-strings.store';

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

    if (!result) {
      GamePredicate.logMessageProduced.next(
        GameStringsStore.createInsufficientAPLogMessage(actor.name, ruleCost)
      );
    }

    return result;
  }
}
