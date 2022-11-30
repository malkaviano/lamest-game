import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RulesHelper } from '../helpers/rules.helper';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from './character.service';
import {
  createActorDiedMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  private isPlayerAlive: boolean;

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

    this.isPlayerAlive = true;

    this.characterService.currentCharacter.hpChanged$.subscribe((event) => {
      this.isPlayerAlive = event.current > 0;
    });
  }

  public run(action: ActionableEvent): RuleResultInterface {
    let logs: LogMessageDefinition[] = [];

    if (this.isPlayerAlive) {
      const playerResult =
        this.dispatcher[action.actionableDefinition.actionable].execute(action);

      const defenseResult = this.rulesHelper.defenseRule.execute();

      logs = playerResult.logs.concat(defenseResult.logs);
    }

    if (!this.isPlayerAlive) {
      logs.push(createActorDiedMessage('player'));
    }

    return {
      logs,
    };
  }
}
