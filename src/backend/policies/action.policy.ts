import { PolicyResultInterface } from '../../core/interfaces/policy-result.interface';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { SettingsStore } from '../../stores/settings.store';
import { MasterPolicy } from './master.policy';

export class ActionPolicy extends MasterPolicy {
  public override enforce(result: RuleResultInterface): PolicyResultInterface {
    if (result.result === 'EXECUTED') {
      const actionPointsSpent = SettingsStore.settings.ruleCost[result.name];

      result.actor.apSpent(actionPointsSpent);

      this.logMessageProduced.next(
        GameStringsStore.createAPSpentLogMessage(
          result.actor.name,
          actionPointsSpent
        )
      );

      return { actionPointsSpent };
    }

    return {};
  }
}
