import { Injectable } from '@angular/core';

import { RulesHelper } from '../helpers/rules.helper';
import { RuleInterface } from '../interfaces/rule.interface';
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
import { LoggingService } from './logging.service';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  private readonly player: PlayerEntity;

  constructor(
    private readonly rulesHelper: RulesHelper,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
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

    this.player = this.characterService.currentCharacter;
  }

  public reactives(interactiveId: string): ActionReactive {
    if (interactiveId === this.player.id) {
      return this.player;
    }

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

    actors.unshift(this.player);

    return new ArrayView(actors);
  }

  public get sceneActorsInfo(): ArrayView<SceneActorsInfoInterface> {
    return new ArrayView(
      this.actors.items.map((a) => {
        return {
          id: a.id,
          situation: a.situation,
          classification: a.classification,
        };
      })
    );
  }

  public run() {
    if (this.isPlayerAlive()) {
      this.actors.items.forEach((actor) => {
        const action = actor.action(this.sceneActorsInfo);

        if (actor.situation === 'ALIVE' && action) {
          const resultLogs = this.dispatcher[
            action.actionableDefinition.actionable
          ].execute(actor, action, this.reactives(action.eventId));

          this.logging(resultLogs.logs);
        }
      });
    }
  }

  private logging(logs: LogMessageDefinition[]): void {
    logs.forEach((log) => this.loggingService.log(log));

    this.sceneActorsInfo.items
      .filter((a) => a.situation === 'DEAD')
      .forEach((a) => {
        const name = this.reactives(a.id).name;

        this.loggingService.log(createActorIsDeadMessage(name));
      });
  }

  private isPlayerAlive(): boolean {
    return this.player.situation === 'ALIVE';
  }
}
