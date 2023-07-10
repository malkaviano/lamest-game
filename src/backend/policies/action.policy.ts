import { PolicyResultInterface } from '@conceptual/interfaces/policy-result.interface';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { SettingsStore } from '../../stores/settings.store';
import { MasterPolicy } from './master.policy';

export class ActionPolicy extends MasterPolicy {
  public override enforce(result: RuleResultInterface): PolicyResultInterface {
    if (result.result !== 'DENIED') {
      const ruleCost = SettingsStore.settings.ruleCost[result.name];

      if (ruleCost > 0) {
        result.actor.apSpent(ruleCost);

        this.logMessageProduced.next(
          GameStringsStore.createAPSpentLogMessage(result.actor.name, ruleCost)
        );

        return { actionPointsSpent: ruleCost };
      }
    }

    return {};
  }
}
