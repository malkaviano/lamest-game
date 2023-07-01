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

export class AffectRule extends MasterRule {
  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly activationAxiomService: ActivationAxiom,
    private readonly dodgeAxiomService: DodgeAxiom,
    private readonly affectedAxiomService: AffectAxiom
  ) {
    super();
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

    const activated = this.activationAxiomService.activation(actor, {
      identity,
      energyActivation,
    });

    let ruleResult: RuleResultLiteral = 'DENIED';

    this.ruleResult.skillName = skillName;

    this.ruleResult.target = target;

    this.ruleResult.affected = actor.weaponEquipped;

    if (activated) {
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

        if (checkResult !== 'IMPOSSIBLE' && usability === 'DISPOSABLE') {
          this.disposeItem(actor, identity.label);
        }
      }

      if (targetWasHit) {
        const dodged =
          targetActor?.wannaDodge(effect.effectType) &&
          this.dodgeAxiomService.dodge(targetActor, {
            dodgeable,
            dodgesPerformed: extras.targetDodgesPerformed ?? 0,
          });

        this.ruleResult.dodged = dodged;

        if (!dodged) {
          const effectAmount =
            this.rollHelper.roll(effect.diceRoll) + effect.fixed;

          this.affectedAxiomService.affectWith(
            target,
            event.actionableDefinition,
            'SUCCESS',
            {
              effect: new EffectEvent(effect.effectType, effectAmount),
            }
          );

          ruleResult = 'EXECUTED';

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
