import { merge, Observable } from 'rxjs';

import { ConsumeRule } from '../rules/consume.rule';
import { InteractionRule } from '../rules/interaction.rule';
import { CombatRule } from '../rules/combat.rule';
import { EquipRule } from '../rules/equip.rule';
import { PickRule } from '../rules/pick.rule';
import { SceneRule } from '../rules/scene.rule';
import { SkillRule } from '../rules/skill.rule';
import { UnEquipRule } from '../rules/unequip.rule';
import { UseRule } from '../rules/use.rule';
import { InspectRule } from '../rules/inspect.rule';
import { RuleInterface } from '../../core/interfaces/rule.interface';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { LoggerInterface } from '../../core/interfaces/logger.interface';

export class RulesHub implements LoggerInterface {
  public readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(
    skillRule: SkillRule,
    pickRule: PickRule,
    equipRule: EquipRule,
    unequipRule: UnEquipRule,
    sceneRule: SceneRule,
    combatRule: CombatRule,
    consumableRule: ConsumeRule,
    interactionRule: InteractionRule,
    useRule: UseRule,
    inspectRule: InspectRule
  ) {
    this.dispatcher = {
      SKILL: skillRule,
      PICK: pickRule,
      EQUIP: equipRule,
      UNEQUIP: unequipRule,
      SCENE: sceneRule,
      AFFECT: combatRule,
      CONSUME: consumableRule,
      INTERACTION: interactionRule,
      USE: useRule,
      INSPECT: inspectRule,
    };

    this.logMessageProduced$ = merge(
      skillRule.logMessageProduced$,
      pickRule.logMessageProduced$,
      equipRule.logMessageProduced$,
      unequipRule.logMessageProduced$,
      sceneRule.logMessageProduced$,
      combatRule.logMessageProduced$,
      consumableRule.logMessageProduced$,
      interactionRule.logMessageProduced$,
      useRule.logMessageProduced$,
      inspectRule.logMessageProduced$
    );
  }
}
