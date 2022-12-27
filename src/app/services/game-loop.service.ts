import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { CharacterService } from './character.service';
import { NarrativeService } from './narrative.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActorEntity } from '../entities/actor.entity';
import { ArrayView } from '../views/array.view';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { PlayerEntity } from '../entities/player.entity';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';
import { SceneDefinition } from '../definitions/scene.definition';
import { RuleDispatcherService } from './rule-dispatcher.service';
import { EventHubHelperService } from '../helpers/event-hub.helper.service';
import { InventoryService } from './inventory.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ActionableItemView } from '../views/actionable-item.view';
import { ActionableEvent } from '../events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private timer: NodeJS.Timer | undefined;

  private readonly player: PlayerEntity;

  private currentScene!: SceneDefinition;

  private actionReactives: { [key: string]: ActionReactiveInterface };

  private actors: ArrayView<ActorInterface>;

  private readonly dodgedThisRound: Map<string, number>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly ruleDispatcherService: RuleDispatcherService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService,
    private readonly eventHubHelperService: EventHubHelperService,
    private readonly inventoryService: InventoryService
  ) {
    this.player = this.characterService.currentCharacter;

    this.actionReactives = {};

    this.actors = ArrayView.create([]);

    this.narrativeService.sceneChanged$.subscribe((scene) => {
      this.currentScene = scene;

      this.setActionReactives();

      this.setActors();
    });

    this.dodgedThisRound = new Map<string, number>();

    this.eventHubHelperService.actorDodged$.subscribe((actorId) => {
      this.actorDodged(actorId);
    });

    const inventoryChanged = inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === this.player.id),
      map(() => {
        const items = this.playerInventory(inventoryService);

        return items;
      })
    );

    this.events = new GameEventsDefinition(
      narrativeService.sceneChanged$,
      eventHubHelperService.logMessageProduced$,
      characterService.characterChanged$,
      inventoryChanged,
      this.eventHubHelperService.documentOpened$,
      this.player.canActChanged$
    );
  }

  public start(): void {
    this.timer = setInterval(() => this.run(), 100);
  }

  public stop(): void {
    clearInterval(this.timer);
  }

  private run(): void {
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

  public actionableReceived(action: ActionableEvent): void {
    this.player.playerDecision(action);
  }

  private playerInventory(
    inventoryService: InventoryService
  ): ArrayView<ActionableItemView> {
    const playerItems = inventoryService.list(this.player.id);

    const inventoryView: ActionableItemView[] = [];

    const items = playerItems.items.reduce((acc, itemStorage) => {
      for (let index = 0; index < itemStorage.quantity; index++) {
        acc.push(
          ActionableItemView.create(
            itemStorage.item,
            this.inventoryAction(itemStorage.item)
          )
        );
      }

      return acc;
    }, inventoryView);

    return ArrayView.create([...items]);
  }

  private inventoryAction(item: GameItemDefinition): ActionableDefinition {
    if (item.category === 'WEAPON') {
      return createActionableDefinition('EQUIP', 'equip', 'Equip');
    }

    if (item.category === 'CONSUMABLE') {
      return createActionableDefinition('CONSUME', 'consume', 'Consume');
    }

    if (item.category === 'READABLE') {
      return createActionableDefinition('INSPECT', 'inspect', 'Inspect');
    }

    return createActionableDefinition('NOOP', 'noop', 'NOOP');
  }
}
