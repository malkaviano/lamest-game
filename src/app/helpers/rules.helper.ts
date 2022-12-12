import { Injectable } from '@angular/core';

import { ConsumeRule } from '../rules/consume.rule';
import { ConversationRule } from '../rules/conversation.rule';
import { CombatRule } from '../rules/combat.rule';
import { EquipRule } from '../rules/equip.rule';
import { PickRule } from '../rules/pick.rule';
import { SceneRule } from '../rules/scene.rule';
import { SkillRule } from '../rules/skill.rule';
import { UnEquipRule } from '../rules/unequip.rule';
import { UseRule } from '../rules/use.rule';

@Injectable({
  providedIn: 'root',
})
export class RulesHelper {
  constructor(
    public readonly skillRule: SkillRule,
    public readonly pickRule: PickRule,
    public readonly equipRule: EquipRule,
    public readonly unequipRule: UnEquipRule,
    public readonly sceneRule: SceneRule,
    public readonly combatRule: CombatRule,
    public readonly consumableRule: ConsumeRule,
    public readonly conversationRule: ConversationRule,
    public readonly useRule: UseRule
  ) {}
}
