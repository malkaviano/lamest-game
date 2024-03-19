import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { SkillStore } from '@stores/skill.store';
import { PlayerEntity } from '@entities/player.entity';
import { SettingsStore } from '@stores/settings.store';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActorEntity } from '@entities/actor.entity';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { TimerNameDefinition } from '@definitions/timer-name.definition';

type CheckResult =
  | {
      readonly name: string;
      readonly duration: number;
      readonly log: LogMessageDefinition;
    }
  | undefined;

export class CooldownPolicy extends PolicyAbstraction {
  constructor(private readonly skillStore: SkillStore) {
    super();
  }

  public override enforce(ruleResult: RuleResult): PolicyResult {
    let policyResult = {};

    let actorResult: CheckResult;

    let targetResult: CheckResult;

    if (ruleResult.result !== 'DENIED') {
      actorResult = this.checkPlayerEngagement(ruleResult);

      this.processResult(ruleResult.actor, actorResult);

      targetResult = this.checkTargetEngagement(ruleResult);

      this.processResult(ruleResult.target as ActorInterface, targetResult);

      policyResult = actorResult
        ? {
            cooldown: {
              name: actorResult.name,
              duration: actorResult.duration,
              target: !!targetResult,
            },
          }
        : {};
    }

    return policyResult;
  }

  private checkTargetEngagement(ruleResult: RuleResult): CheckResult {
    let targetResult: CheckResult;

    let cooldownKey: string | undefined;

    let cooldownDuration: number | undefined;

    let log: LogMessageDefinition | undefined;

    if (
      ruleResult.name === 'AFFECT' &&
      ruleResult.target instanceof PlayerEntity
    ) {
      cooldownKey = TimerNameDefinition.ENGAGEMENT;

      cooldownDuration =
        SettingsStore.settings.timersInMilliseconds.engagementTimer;

      log = GameStringsStore.createEngagementTimerLogMessage(
        ruleResult.target.name,
        cooldownDuration
      );

      targetResult = {
        name: cooldownKey,
        duration: cooldownDuration,
        log,
      };
    }

    return targetResult;
  }

  private checkPlayerEngagement(ruleResult: RuleResult): CheckResult {
    let actorResult: CheckResult;

    if (ruleResult.actor instanceof PlayerEntity && ruleResult.skillName) {
      const skillName = ruleResult.skillName;

      const skill = this.skillStore.skills[skillName];

      let cooldownKey: string | undefined;

      let cooldownDuration: number | undefined;

      let log: LogMessageDefinition | undefined;

      if (skill.combat) {
        if (ruleResult.target instanceof ActorEntity) {
          cooldownKey = TimerNameDefinition.ENGAGEMENT;

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
        actorResult = {
          name: cooldownKey,
          duration: cooldownDuration,
          log,
        };
      }
    }

    return actorResult;
  }

  private processResult(actor: ActorInterface, result: CheckResult): void {
    if (actor?.cooldowns) {
      const hadEngagement = actor.cooldowns[TimerNameDefinition.ENGAGEMENT];

      if (result) {
        this.addCooldown(actor, result.name, result.duration);

        if (
          !(result.name === TimerNameDefinition.ENGAGEMENT && hadEngagement)
        ) {
          this.log(result.log);
        }
      }
    }
  }

  private log(log: LogMessageDefinition): void {
    this.logMessageProduced.next(log);
  }

  private addCooldown(
    actor: ActorInterface,
    key: string,
    duration: number
  ): void {
    actor.addCooldown(key, duration);
  }
}
