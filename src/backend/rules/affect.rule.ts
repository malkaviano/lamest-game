import { RollHelper } from '../../core/helpers/roll.helper';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActivationAxiom } from '../../core/axioms/activation.axiom';
import { DodgeAxiom } from '../../core/axioms/dodge.axiom';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';
import { ConverterHelper } from '../../core/helpers/converter.helper';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { CheckResultLiteral } from '../../core/literals/check-result.literal';

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

  public execute(
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

    const result: RuleResultInterface = {
      event,
      actor,
      target,
      result: 'DENIED',
      affected: actor.weaponEquipped,
      skill: { name: skillName },
    };

    const activated = this.activationAxiomService.activation(actor, {
      identity,
      energyActivation,
    });

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

        Object.assign(result, { skill: { name: skillName, roll } });

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

        Object.assign(result, { dodged });

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

          Object.assign(result, {
            result: 'AFFECTED',
            effect: { type: effect.effectType, amount: effectAmount },
          });
        }
      }

      actor.changeVisibility('VISIBLE');

      targetActor?.afflictedBy(actor.id);

      targetActor?.changeVisibility('VISIBLE');
    }

    return result;
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
