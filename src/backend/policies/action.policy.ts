import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { SettingsStore } from '@stores/settings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';

export class ActionPolicy extends PolicyAbstraction {
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
