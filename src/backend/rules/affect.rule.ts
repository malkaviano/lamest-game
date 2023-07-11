import { Observable } from 'rxjs';

import { ActivationAxiom } from '@axioms/activation.axiom';
import { AffectAxiom } from '@axioms/affect.axiom';
import { DodgeAxiom } from '@axioms/dodge.axiom';
import { ActionableEvent } from '@events/actionable.event';
import { EffectEvent } from '@events/effect.event';
import { ConverterHelper } from '@helpers/converter.helper';
import { RollHelper } from '@helpers/roll.helper';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { CheckedService } from '../services/checked.service';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { ItemIdentityDefinition } from '../conceptual/definitions/item-identity.definition';
import { InteractiveInterface } from '../conceptual/interfaces/interactive.interface';
import { EffectDefinition } from '../conceptual/definitions/effect.definition';

export class AffectRule
  extends RuleAbstraction
  implements ActorDodgedInterface
{
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

      const targetActor = ConverterHelper.asActor(target);

      if (targetActor) {
        this.tryHitTargetActor(
          actor,
          skillName,
          targetActor,
          effect,
          dodgeable,
          extras
        );
      }

      const rolled = this.ruleResult.roll?.result !== 'IMPOSSIBLE';

      if (rolled) {
        this.logItemUsed(actor, target, identity);
      }

      if (usability === 'DISPOSABLE' && (rolled || !targetActor)) {
        this.disposeItem(actor, identity.label);
      }

      if (!targetActor || !this.ruleResult.dodged) {
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

      targetActor?.afflictedBy(actor.id);
    }

    return this.getResult(event, actor, ruleResult);
  }

  private tryHitTargetActor(
    actor: ActorInterface,
    skillName: string,
    targetActor: ActorInterface,
    effect: EffectDefinition,
    dodgeable: boolean,
    extras: RuleExtrasInterface
  ) {
    const { checkResult, roll } = this.checkSkill(actor, skillName);

    const targetWasHit = checkResult === 'SUCCESS';

    this.ruleResult.roll = {
      checkRoll: roll,
      result: checkResult,
    };

    if (targetWasHit) {
      const dodged =
        targetActor?.wannaDodge(effect.effectType) &&
        this.dodgeAxiom.dodged(
          targetActor,
          dodgeable,
          extras.targetDodgesPerformed ?? 0
        );

      this.ruleResult.dodged = dodged;
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
    skillName: string
  ): { checkResult: CheckResultLiteral; roll: number } {
    const { result, roll } = this.rollHelper.actorSkillCheck(actor, skillName);

    return { checkResult: result, roll };
  }
}
