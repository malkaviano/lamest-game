import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { SkillStore } from '@stores/skill.store';
import { PlayerEntity } from '@entities/player.entity';
import { SettingsStore } from '@stores/settings.store';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActorEntity } from '@entities/actor.entity';
import { LogMessageDefinition } from '@definitions/log-message.definition';

export class CooldownPolicy extends PolicyAbstraction {
  constructor(private readonly skillStore: SkillStore) {
    super();
  }

  public override enforce(ruleResult: RuleResult): PolicyResult {
    let policyResult = {};

    policyResult = this.checkActorEngagement(ruleResult, policyResult);

    return policyResult;
  }

  private checkActorEngagement(ruleResult: RuleResult, policyResult: {}) {
    if (
      ruleResult.actor instanceof PlayerEntity &&
      ruleResult.result !== 'DENIED' &&
      ruleResult.skillName
    ) {
      const skillName = ruleResult.skillName;

      const skill = this.skillStore.skills[skillName];

      let cooldownKey: string | undefined;

      let cooldownDuration: number | undefined;

      let log: LogMessageDefinition | undefined;

      if (skill.combat) {
        if (ruleResult.target instanceof ActorEntity) {
          cooldownKey = 'ENGAGEMENT';

          cooldownDuration =
            SettingsStore.settings.timersInMilliseconds.engagementTimer;

          log = GameStringsStore.createEngagementTimerLogMessage(
            ruleResult.actor.name,
            cooldownDuration
          );
        }
      } else {
        cooldownDuration =
          SettingsStore.settings.timersInMilliseconds.skillCooldown;

        cooldownKey = skillName;

        log = GameStringsStore.createSkillOnCooldownLogMessage(
          ruleResult.actor.name,
          cooldownKey,
          cooldownDuration
        );
      }

      if (cooldownKey && cooldownDuration && log) {
        ruleResult.actor.addCooldown(cooldownKey, cooldownDuration);

        policyResult = {
          cooldown: {
            actor: {
              name: cooldownKey,
              duration: cooldownDuration,
            },
          },
        };

        this.logMessageProduced.next(log);
      }
    }
    return policyResult;
  }
}
