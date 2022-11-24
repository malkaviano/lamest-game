import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
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
    [key: string]: (actionableEvent: ActionableEvent) => void;
  };

  constructor(
    skillRule: SkillRule,
    pickRule: PickRule,
    equipRule: EquipRule,
    unequipRule: UnequipRule,
    sceneRule: SceneRule
  ) {
    this.dispatcher = {
      SKILL: skillRule.execute,
      PICK: pickRule.execute,
      EQUIP: equipRule.execute,
      USE: (action: ActionableEvent): void => {
        console.log(action.actionableDefinition, action.eventId);
      },
      UNEQUIP: unequipRule.execute,
      SCENE: sceneRule.execute,
    };
  }

  public run(action: ActionableEvent): void {
    this.dispatcher[action.actionableDefinition.actionable](action);
  }
}
