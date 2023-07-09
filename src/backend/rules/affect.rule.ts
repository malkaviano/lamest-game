import { Observable } from 'rxjs';

import { ActivationAxiom } from '../../core/axioms/activation.axiom';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { DodgeAxiom } from '../../core/axioms/dodge.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';
import { ConverterHelper } from '../../core/helpers/converter.helper';
import { RollHelper } from '../../core/helpers/roll.helper';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { CheckResultLiteral } from '../../core/literals/check-result.literal';
import { RuleNameLiteral } from '../../core/literals/rule-name.literal';
import { RuleResultLiteral } from '../../core/literals/rule-result.literal';
import { GameStringsStore } from '../../stores/game-strings.store';
import { CheckedService } from '../services/checked.service';
import { MasterRule } from './master.rule';
import { ActorDodgedInterface } from '../../core/interfaces/actor-dodged.interface';

export class AffectRule extends MasterRule implements ActorDodgedInterface {
  public readonly actorDodged$: Observable<string>;

  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly activationAxiom: ActivationAxiom,
    private readonly dodgeAxiom: DodgeAxiom,
    private readonly affectedAxiom: AffectAxiom
  ) {
    super();

    this.actorDodged$ = this.dodgeAxiom.actorDodged$;
  }

  public override get name(): RuleNameLiteral {
    return 'AFFECT';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const {
      dodgeable,
      damage: effect,
      skillName,
      identity,
      usability,
      energyActivation,
    } = actor.weaponEquipped;

    let ruleResult: RuleResultLiteral = 'DENIED';

    this.ruleResult.skillName = skillName;

    this.ruleResult.target = target;

    this.ruleResult.affected = actor.weaponEquipped;

    const activated = this.activationAxiom.activation(
      actor,
      energyActivation,
      identity.label
    );

    if (activated) {
      ruleResult = 'AVOIDED';

      let targetWasHit = true;

      const targetActor = ConverterHelper.asActor(target);

      if (targetActor) {
        const { checkResult, roll } = this.checkSkill(
          actor,
          skillName,
          targetActor,
          identity.label
        );

        targetWasHit = checkResult === 'SUCCESS';

        this.ruleResult.checkRoll = roll;

        if (usability === 'DISPOSABLE') {
          this.disposeItem(actor, identity.label);
        }
      }

      if (targetWasHit) {
        const dodged =
          targetActor?.wannaDodge(effect.effectType) &&
          this.dodgeAxiom.dodged(
            targetActor,
            dodgeable,
            extras.targetDodgesPerformed ?? 0
          );

        this.ruleResult.dodged = dodged;

        if (!dodged) {
          ruleResult = 'EXECUTED';

          const effectAmount =
            this.rollHelper.roll(effect.diceRoll) + effect.fixed;

          this.affectedAxiom.affectWith(
            target,
            event.actionableDefinition,
            'SUCCESS',
            {
              effect: new EffectEvent(effect.effectType, effectAmount),
            }
          );

          this.ruleResult.effectType = effect.effectType;
          this.ruleResult.effectAmount = effectAmount;
        }
      }

      targetActor?.afflictedBy(actor.id);
    }

    return this.getResult(event, actor, ruleResult);
  }

  private disposeItem(actor: ActorInterface, label: string): void {
    actor.unEquip();

    const logMessage = GameStringsStore.createLostItemLogMessage(
      actor.name,
      label
    );

    this.ruleLog.next(logMessage);
  }

  private checkSkill(
    actor: ActorInterface,
    skillName: string,
    target: ActorInterface,
    weaponLabel: string
  ): { checkResult: CheckResultLiteral; roll: number } {
    const { result, roll } = this.rollHelper.actorSkillCheck(actor, skillName);

    if (result === 'SUCCESS') {
      const logMessage = GameStringsStore.createUsedItemLogMessage(
        actor.name,
        target.name,
        weaponLabel
      );

      this.ruleLog.next(logMessage);
    }

    return { checkResult: result, roll };
  }
}
