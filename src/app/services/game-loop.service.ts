import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RulesHelper } from '../helpers/rules.helper';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from './character.service';
import {
  createActorIsDeadMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { NarrativeService } from './narrative.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActorEntity } from '../entities/actor.entity';
import { ArrayView } from '../views/array.view';
import { ActionReactive } from '../interfaces/action-reactive.interface';
import { PlayerEntity } from '../entities/player.entity';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  private readonly player: PlayerEntity;

  private isPlayerAlive: boolean;

  constructor(
    private readonly rulesHelper: RulesHelper,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService
  ) {
    this.dispatcher = {
      SKILL: this.rulesHelper.skillRule,
      PICK: this.rulesHelper.pickRule,
      EQUIP: this.rulesHelper.equipRule,
      UNEQUIP: this.rulesHelper.unequipRule,
      SCENE: this.rulesHelper.sceneRule,
      ATTACK: this.rulesHelper.combatRule,
      CONSUME: this.rulesHelper.consumableRule,
      ASK: this.rulesHelper.conversationRule,
    };

    this.isPlayerAlive = true;

    this.player = this.characterService.currentCharacter;

    this.player.hpChanged$.subscribe((event) => {
      this.isPlayerAlive = event.current > 0;
    });
  }

  public reactives(interactiveId: string): ActionReactive {
    return this.narrativeService.interatives[interactiveId];
  }

  public get actors(): ArrayView<ActorInterface> {
    const actors: ActorInterface[] = [];

    Object.entries(this.narrativeService.interatives).forEach(
      ([, interactive]) => {
        if (interactive instanceof ActorEntity) {
          actors.push(interactive);
        }
      }
    );

    return new ArrayView(actors);
  }

  public run(action: ActionableEvent): RuleResultInterface {
    let logs: LogMessageDefinition[] = [];

    if (this.isPlayerAlive) {
      const playerResult = this.dispatcher[
        action.actionableDefinition.actionable
      ].execute(this.player, action, this.reactives(action.eventId));

      logs = logs.concat(playerResult.logs);

      this.actors.items.forEach((actor) => {
        if (actor.action && actor.situation === 'ALIVE') {
          const resultLogs = this.dispatcher[actor.action.actionable].execute(
            actor,
            action,
            this.player
          );

          logs = logs.concat(resultLogs.logs);
        }
      });
    }

    if (!this.isPlayerAlive) {
      logs.push(createActorIsDeadMessage(this.player.name));
    }

    return {
      logs,
    };
  }
}
