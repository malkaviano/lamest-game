import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
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
    private readonly characterService: CharacterService,
    private readonly loggingService: LoggingService
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

  public run(action: ActionableEvent): void {
    if (this.characterService.currentCharacter.derivedAttributes.hp.value > 0) {
      let { logs: playerLogs } =
        this.dispatcher[action.actionableDefinition.actionable].execute(action);

      playerLogs.forEach((log) => this.loggingService.log(log));

      const { logs: npcLogs } = this.defenseRule.execute(action);

      npcLogs.forEach((log) => this.loggingService.log(log));
    }
  }
}
