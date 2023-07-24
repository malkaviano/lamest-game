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
    let actorResult:
      | {
          readonly name: string;
          readonly duration: number;
        }
      | undefined;

    let targetResult = false;

    if (ruleResult.result !== 'DENIED') {
      actorResult = this.checkPlayerEngagement(ruleResult);

      targetResult = this.checkTargetEngagement(ruleResult, targetResult);
    }

    return actorResult
      ? { cooldown: { ...actorResult, target: targetResult } }
      : {};
  }

  private checkTargetEngagement(ruleResult: RuleResult, targetResult: boolean) {
    if (
      ruleResult.name === 'AFFECT' &&
      ruleResult.target instanceof PlayerEntity
    ) {
      const targetDuration =
        SettingsStore.settings.timersInMilliseconds.engagementTimer;

      const log = GameStringsStore.createEngagementTimerLogMessage(
        ruleResult.target.name,
        targetDuration
      );

      this.logMessageProduced.next(log);

      ruleResult.target.addCooldown('ENGAGEMENT', targetDuration);

      targetResult = true;
    }
    return targetResult;
  }

  private checkPlayerEngagement(ruleResult: RuleResult):
    | {
        name: string;
        duration: number;
      }
    | undefined {
    let actorResult:
      | {
          name: string;
          duration: number;
        }
      | undefined;

    if (ruleResult.actor instanceof PlayerEntity && ruleResult.skillName) {
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

        actorResult = {
          name: cooldownKey,
          duration: cooldownDuration,
        };

        this.logMessageProduced.next(log);
      }
    }

    return actorResult;
  }
}
