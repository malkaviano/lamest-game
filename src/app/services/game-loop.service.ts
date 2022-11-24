import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { EquipRule } from '../rules/equip.rule';
import { PickRule } from '../rules/pick.rule';
import { SceneRule } from '../rules/scene.rule';
import { SkillRule } from '../rules/skill.rule';
import { UnequipRule } from '../rules/unequip.rule';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  constructor(
    skillRule: SkillRule,
    pickRule: PickRule,
    equipRule: EquipRule,
    unequipRule: UnequipRule,
    sceneRule: SceneRule
  ) {
    console.log('GG');
    this.dispatcher = {
      SKILL: skillRule,
      PICK: pickRule,
      EQUIP: equipRule,
      UNEQUIP: unequipRule,
      SCENE: sceneRule,
    };
  }

  public run(action: ActionableEvent): void {
    this.dispatcher[action.actionableDefinition.actionable].execute(action);
  }
}
