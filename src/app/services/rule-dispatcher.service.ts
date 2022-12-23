import { Injectable } from '@angular/core';

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
import { RuleInterface } from '../interfaces/rule.interface';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ReadableInterface } from '../interfaces/readable.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { ActorDodgedInterface } from '../interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '../interfaces/document-opened.interface';

@Injectable({
  providedIn: 'root',
})
export class RuleDispatcherService
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

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
      useRule.logMessageProduced$,
      unequipRule.logMessageProduced$,
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

    this.actorDodged$ = combatRule.actorDodged$;

    this.documentOpened$ = inspectRule.documentOpened$;
  }
}
