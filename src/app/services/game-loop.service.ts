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
import { SceneDefinition } from '../definitions/scene.definition';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly dispatcher: {
    [key: string]: RuleInterface;
  };

  private readonly player: PlayerEntity;

  private currentScene!: SceneDefinition;

  private actionReactives: { [key: string]: ActionReactive };

  private actors: ArrayView<ActorInterface>;

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

    this.actionReactives = {};

    this.actors = ArrayView.create([]);

    this.narrativeService.sceneChanged$.subscribe((scene) => {
      this.currentScene = scene;

      this.setActionReactives();

      this.setActors();
    });
  }

  public run(): void {
    if (this.isPlayerAlive()) {
      this.actors.items.forEach((actor) => {
        const action = actor.action(this.sceneActorsInfo);

        if (actor.situation === 'ALIVE' && action) {
          const target = this.actionReactives[action.eventId];

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

  private setActionReactives(): void {
    this.actionReactives = this.currentScene.interactives.items.reduce(
      (map: { [key: string]: ActionReactive }, i) => {
        map[i.id] = i;

        return map;
      },
      {}
    );

    this.actionReactives[this.player.id] = this.player;
  }

  private setActors(): void {
    const actors: ActorInterface[] = [];

    this.currentScene.interactives.items.forEach((interactive) => {
      if (interactive instanceof ActorEntity) {
        actors.push(interactive);
      }
    });

    actors.unshift(this.player);

    this.actors = ArrayView.create(actors);
  }

  private get sceneActorsInfo(): ArrayView<SceneActorsInfoInterface> {
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
}
