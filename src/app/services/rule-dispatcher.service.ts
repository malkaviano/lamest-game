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

@Injectable({
  providedIn: 'root',
})
export class RuleDispatcherService {
  public readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  public readonly logMessagePublished$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  constructor(
    private readonly skillRule: SkillRule,
    private readonly pickRule: PickRule,
    private readonly equipRule: EquipRule,
    private readonly unequipRule: UnEquipRule,
    private readonly sceneRule: SceneRule,
    private readonly combatRule: CombatRule,
    private readonly consumableRule: ConsumeRule,
    private readonly interactionRule: InteractionRule,
    private readonly useRule: UseRule,
    private readonly inspectRule: InspectRule
  ) {
    this.dispatcher = {
      SKILL: this.skillRule,
      PICK: this.pickRule,
      EQUIP: this.equipRule,
      UNEQUIP: this.unequipRule,
      SCENE: this.sceneRule,
      AFFECT: this.combatRule,
      CONSUME: this.consumableRule,
      INTERACTION: this.interactionRule,
      USE: this.useRule,
      INSPECT: this.inspectRule,
    };

    this.logMessagePublished$ = merge(
      this.useRule.ruleLog$,
      this.unequipRule.ruleLog$,
      this.skillRule.ruleLog$,
      this.pickRule.ruleLog$,
      this.equipRule.ruleLog$,
      this.unequipRule.ruleLog$,
      this.sceneRule.ruleLog$,
      this.combatRule.ruleLog$,
      this.consumableRule.ruleLog$,
      this.interactionRule.ruleLog$,
      this.useRule.ruleLog$,
      this.inspectRule.ruleLog$
    );

    this.actorDodged$ = this.combatRule.actorDodged$;
  }
}
