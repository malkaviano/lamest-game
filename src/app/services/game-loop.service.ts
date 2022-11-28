import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RulesHelper } from '../helpers/rules.helper';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  constructor(
    private readonly rulesHelper: RulesHelper,
    private readonly characterService: CharacterService
  ) {
    this.dispatcher = {
      SKILL: this.rulesHelper.skillRule,
      PICK: this.rulesHelper.pickRule,
      EQUIP: this.rulesHelper.equipRule,
      UNEQUIP: this.rulesHelper.unequipRule,
      SCENE: this.rulesHelper.sceneRule,
      ATTACK: this.rulesHelper.attackRule,
      CONSUME: this.rulesHelper.consumableRule,
      ASK: this.rulesHelper.conversationRule,
    };
  }

  public run(action: ActionableEvent): RuleResult {
    let logs: string[] = [];

    if (this.characterService.currentCharacter.derivedAttributes.hp.value > 0) {
      const playerResult =
        this.dispatcher[action.actionableDefinition.actionable].execute(action);

      const defenseResult = this.rulesHelper.defenseRule.execute(action);

      logs = playerResult.logs.concat(defenseResult.logs);
    }

    return {
      logs,
    };
  }
}
