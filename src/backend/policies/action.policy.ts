import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { GameStringsStore } from '@stores/game-strings.store';
import { SettingsStore } from '@stores/settings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PlayerEntity } from '@entities/player.entity';
import { ActorInterface } from '@interfaces/actor.interface';
import { ConverterHelper } from '@helpers/converter.helper';

export class ActionPolicy extends PolicyAbstraction {
  public override enforce(result: RuleResult): PolicyResult {
    let policyResult = {};

    if (result.result !== 'DENIED') {
      const ruleCost = SettingsStore.settings.ruleCost[result.name];

      if (ruleCost > 0) {
        this.spentAP(result.actor, ruleCost);

        policyResult = { ...policyResult, actorActionPointsSpent: ruleCost };
      }

      const target = ConverterHelper.asActor(result.target);

      if (target && result.dodged) {
        const dodgeCost = SettingsStore.settings.dodgeAPCost;

        this.spentAP(target, dodgeCost);

        policyResult = { ...policyResult, targetActionPointsSpent: dodgeCost };
      }
    }

    return policyResult;
  }

  private spentAP(actor: ActorInterface, spent: number) {
    actor.apSpent(spent);

    if (actor instanceof PlayerEntity) {
      this.logMessageProduced.next(
        GameStringsStore.createAPSpentLogMessage(actor.name, spent)
      );
    }
  }
}
