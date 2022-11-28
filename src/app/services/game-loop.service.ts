import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { AttackRule } from '../rules/attack.rule';
import { ConsumeRule } from '../rules/consume.rule';
import { ConversationRule } from '../rules/conversation.rule';
import { DefenseRule } from '../rules/defense.rule';
import { EquipRule } from '../rules/equip.rule';
import { PickRule } from '../rules/pick.rule';
import { SceneRule } from '../rules/scene.rule';
import { SkillRule } from '../rules/skill.rule';
import { UnequipRule } from '../rules/unequip.rule';
import { CharacterService } from './character.service';
import { LoggingService } from './logging.service';

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
    sceneRule: SceneRule,
    combatRule: AttackRule,
    consumableRule: ConsumeRule,
    conversationRule: ConversationRule,
    private readonly defenseRule: DefenseRule,
    private readonly characterService: CharacterService
  ) {
    this.dispatcher = {
      SKILL: skillRule,
      PICK: pickRule,
      EQUIP: equipRule,
      UNEQUIP: unequipRule,
      SCENE: sceneRule,
      ATTACK: combatRule,
      CONSUME: consumableRule,
      ASK: conversationRule,
    };
  }

  public run(action: ActionableEvent): RuleResult {
    let logs: string[] = [];

    if (this.characterService.currentCharacter.derivedAttributes.hp.value > 0) {
      const playerResult =
        this.dispatcher[action.actionableDefinition.actionable].execute(action);

      const defenseResult = this.defenseRule.execute(action);

      logs = playerResult.logs.concat(defenseResult.logs);
    }

    return {
      logs,
    };
  }
}
