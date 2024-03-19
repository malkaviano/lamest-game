import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { ConverterHelper } from '@helpers/converter.helper';
import { GameStringsStore } from '@stores/game-strings.store';

export class StatusPolicy extends PolicyAbstraction {
  public override enforce(result: RuleResult): PolicyResult {
    let policyResult = {};

    const target = ConverterHelper.asActor(result.target);

    if (target && target.situation === 'DEAD' && result.name !== 'PICK') {
      this.logMessageProduced.next(
        GameStringsStore.createActorIsDeadLogMessage(target.name)
      );

      policyResult = { dead: target };
    }

    return policyResult;
  }
}
