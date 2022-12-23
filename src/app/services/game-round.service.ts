import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CharacterService } from './character.service';
import { NarrativeService } from './narrative.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActorEntity } from '../entities/actor.entity';
import { ArrayView } from '../views/array.view';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { PlayerEntity } from '../entities/player.entity';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';
import { SceneDefinition } from '../definitions/scene.definition';
import { DocumentOpenedInterface } from '../interfaces/reader-dialog.interface';
import { RuleDispatcherService } from './rule-dispatcher.service';

@Injectable({
  providedIn: 'root',
})
export class GameRoundService {
  private readonly player: PlayerEntity;

  private currentScene!: SceneDefinition;

  private actionReactives: { [key: string]: ActionReactiveInterface };

  private actors: ArrayView<ActorInterface>;

  private readonly dodgedThisRound: Map<string, number>;

  public readonly documentOpened$: Observable<DocumentOpenedInterface>;

  constructor(
    private readonly ruleDispatcherService: RuleDispatcherService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService
  ) {
    this.player = this.characterService.currentCharacter;

    this.actionReactives = {};

    this.actors = ArrayView.create([]);

    this.narrativeService.sceneChanged$.subscribe((scene) => {
      this.currentScene = scene;

      this.setActionReactives();

      this.setActors();
    });

    this.documentOpened$ = this.ruleDispatcherService.documentOpened$;

    this.dodgedThisRound = new Map<string, number>();

    this.ruleDispatcherService.actorDodged$.subscribe((actorId) => {
      this.actorDodged(actorId);
    });
  }

  public run(): void {
    if (this.isPlayerAlive()) {
      this.dodgedThisRound.clear();

      this.actors.items.forEach((actor) => {
        const action = actor.action(this.sceneActorsInfo);

        if (actor.situation === 'ALIVE' && action) {
          const target = this.actionReactives[action.eventId];

          this.ruleDispatcherService.dispatcher[
            action.actionableDefinition.actionable
          ].execute(actor, action, {
            target,
            targetDodgesPerformed: this.dodgedThisRound.get(target?.id),
          });
        }
      });
    }
  }

  private actorDodged(targetId: string): void {
    const dodges = this.dodgedThisRound.get(targetId) ?? 0;

    this.dodgedThisRound.set(targetId, dodges + 1);
  }

  private isPlayerAlive(): boolean {
    return this.player.situation === 'ALIVE';
  }

  private setActionReactives(): void {
    this.actionReactives = this.currentScene.interactives.items.reduce(
      (map: { [key: string]: ActionReactiveInterface }, i) => {
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
          visibility: a.visibility,
        };
      })
    );
  }
}
