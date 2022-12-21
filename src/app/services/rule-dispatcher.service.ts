import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class RuleDispatcherService {
  public readonly dispatcher: {
    [key: string]: RuleInterface;
  };

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
  }
}
