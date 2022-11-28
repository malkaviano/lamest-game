import { Injectable } from '@angular/core';

import { AttackRule } from '../rules/attack.rule';
import { ConsumeRule } from '../rules/consume.rule';
import { ConversationRule } from '../rules/conversation.rule';
import { DefenseRule } from '../rules/defense.rule';
import { EquipRule } from '../rules/equip.rule';
import { PickRule } from '../rules/pick.rule';
import { SceneRule } from '../rules/scene.rule';
import { SkillRule } from '../rules/skill.rule';
import { UnequipRule } from '../rules/unequip.rule';

@Injectable({
  providedIn: 'root',
})
export class RulesHelper {
  constructor(
    public readonly skillRule: SkillRule,
    public readonly pickRule: PickRule,
    public readonly equipRule: EquipRule,
    public readonly unequipRule: UnequipRule,
    public readonly sceneRule: SceneRule,
    public readonly attackRule: AttackRule,
    public readonly consumableRule: ConsumeRule,
    public readonly conversationRule: ConversationRule,
    public readonly defenseRule: DefenseRule
  ) {}
}
