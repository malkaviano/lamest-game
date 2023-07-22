import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { GameStringsStore } from '@stores/game-strings.store';
import { EffectEvent } from '@events/effect.event';
import { PolicyValues } from '@values/policy.values';

// DEBIT: subpar implementation, just migrated
export class EffectPolicy extends PolicyAbstraction {
  public override enforce(
    result: RuleResult,
    policyValues: PolicyValues
  ): PolicyResult {
    let policyResult: PolicyResult = {};

    if (result.result === 'EXECUTED') {
      const target = result.target ?? result.actor;

      policyResult = { affected: target };

      const rollResult = result.roll?.result ?? 'NONE';

      const consumableEffect = result.consumable?.hp
        ? new EffectEvent(
            result.consumable.consumed.effect,
            result.consumable.hp
          )
        : undefined;

      const ruleEffect = result.effect
        ? new EffectEvent(result.effect.type, result.effect.amount)
        : undefined;

      const effect = consumableEffect ?? ruleEffect;

      const energy = result.consumable?.energy;

      const values = {
        item: result.affected ?? result.consumable?.consumed ?? result.used,
        effect,
        energy: energy,
        actor: result.actor,
        target: result.target,
      };

      const log = target.reactTo(policyValues.action, rollResult, values);

      if (log) {
        const logMessage = GameStringsStore.createFreeLogMessage(
          'AFFECTED',
          target.name,
          log
        );

        this.logMessageProduced.next(logMessage);
      }
    }

    return policyResult;
  }
}
