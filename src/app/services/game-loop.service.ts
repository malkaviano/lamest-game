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
      AFFECT: this.rulesHelper.combatRule,
      CONSUME: this.rulesHelper.consumableRule,
      INTERACTION: this.rulesHelper.interactionRule,
      USE: this.rulesHelper.useRule,
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

    return ArrayView.create(actors);
  }

  public get sceneActorsInfo(): ArrayView<SceneActorsInfoInterface> {
    return ArrayView.create(
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
          const target = this.reactives(action.eventId);

          const resultLogs = this.dispatcher[
            action.actionableDefinition.actionable
          ].execute(actor, action, target);

          this.logging(resultLogs.logs);

          if (
            target &&
            target instanceof ActorEntity &&
            target.situation === 'DEAD'
          ) {
            this.logging([createActorIsDeadMessage(target.name)]);
          }
        }
      });
    }
  }

  private logging(logs: LogMessageDefinition[]): void {
    logs.forEach((log) => this.loggingService.log(log));
  }

  private isPlayerAlive(): boolean {
    return this.player.situation === 'ALIVE';
  }
}
