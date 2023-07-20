import { DodgeAxiom } from '@axioms/dodge.axiom';
import { ActionableEvent } from '@events/actionable.event';
import { EffectEvent } from '@events/effect.event';
import { ConverterHelper } from '@helpers/converter.helper';
import { RollHelper } from '@helpers/roll.helper';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValues } from '@values/rule.value';
import { RuleResult } from '@results/rule.result';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { CheckedService } from '@services/checked.service';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { EffectDefinition } from '@definitions/effect.definition';
import { GamePredicate } from '@predicates/game.predicate';

export class AffectRule extends RuleAbstraction {
  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly dodgeAxiom: DodgeAxiom,
    private readonly gamePredicate: GamePredicate
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'AFFECT';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValues
  ): RuleResult {
    this.ruleResult = {};

    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const {
      dodgeable,
      damage: effect,
      skillName,
      identity,
      energyActivation,
    } = actor.weaponEquipped;

    let ruleResult: RuleResultLiteral = 'DENIED';

    this.ruleResult.skillName = skillName;

    this.ruleResult.target = target;

    this.ruleResult.affected = actor.weaponEquipped;

    const executable = this.canExecute(
      actor,
      skillName,
      energyActivation,
      identity
    );

    if (executable) {
      this.logItemUsed(actor, target, identity);

      this.activation(actor, energyActivation, identity.label);

      ruleResult = 'AVOIDED';

      const targetActor = ConverterHelper.asActor(target);

      if (targetActor) {
        this.tryHitTargetActor(
          actor,
          skillName,
          targetActor,
          effect,
          dodgeable
        );
      }

      if (
        !targetActor ||
        (!this.ruleResult.dodged && this.ruleResult.roll?.result === 'SUCCESS')
      ) {
        ruleResult = 'EXECUTED';

        const effectAmount =
          this.rollHelper.roll(effect.diceRoll) + effect.fixed;

        this.affectWith(target, event.actionableDefinition, 'SUCCESS', {
          effect: new EffectEvent(effect.effectType, effectAmount),
        });

        this.ruleResult.effect = {
          type: effect.effectType,
          amount: effectAmount,
        };
      } else if (this.ruleResult.dodged) {
        this.actorDodged.next(targetActor.id);
      }

      targetActor?.afflictedBy(actor.id);
    }

    return this.getResult(event, actor, ruleResult);
  }

  private canExecute(
    actor: ActorInterface,
    skillName: string,
    energyActivation: number,
    identity: ItemIdentityDefinition
  ) {
    return (
      this.gamePredicate.canUseSkill(actor, skillName) &&
      this.gamePredicate.canActivate(actor, energyActivation, identity.label)
    );
  }

  private tryHitTargetActor(
    actor: ActorInterface,
    skillName: string,
    targetActor: ActorInterface,
    effect: EffectDefinition,
    dodgeable: boolean
  ) {
    const { checkResult, roll } = this.checkSkill(actor, skillName);

    const targetWasHit = checkResult === 'SUCCESS';

    this.ruleResult.roll = {
      checkRoll: roll,
      result: checkResult,
    };

    if (targetWasHit) {
      if (targetActor?.wannaDodge(effect.effectType)) {
        this.ruleResult.dodged = this.dodgeAxiom.dodged(targetActor, dodgeable);
      }
    }
  }

  private logItemUsed(
    actor: ActorInterface,
    target: InteractiveInterface,
    identity: ItemIdentityDefinition
  ) {
    const logMessage = GameStringsStore.createUsedItemLogMessage(
      actor.name,
      target.name,
      identity.label
    );

    this.ruleLog.next(logMessage);
  }

  private checkSkill(
    actor: ActorInterface,
    skillName: string
  ): { checkResult: CheckResultLiteral; roll: number } {
    const { result, roll } = this.rollHelper.actorSkillCheck(actor, skillName);

    return { checkResult: result, roll };
  }
}
