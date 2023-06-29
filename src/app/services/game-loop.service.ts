import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { CharacterService } from '../../backend/services/character.service';
import { NarrativeService } from '../../backend/services/narrative.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { SceneActorsInfoInterface } from '../../core/interfaces/scene-actors.interface';
import { SceneDefinition } from '../../core/definitions/scene.definition';
import { RulesHub } from '../../backend/services/rules.hub';
import { InventoryService } from '../../backend/services/inventory.service';
import { GameEventsDefinition } from '../../core/definitions/game-events.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../../core/definitions/actionable.definition';
import { GameItemDefinition } from '../../core/definitions/game-item.definition';
import { ArrayView } from '../../core/view-models/array.view';
import { ActionableItemView } from '../../core/view-models/actionable-item.view';
import { ActionableEvent } from '../../core/events/actionable.event';
import { PlayerInterface } from '../../core/interfaces/player.interface';
import { ActorEntity } from '../../core/entities/actor.entity';
import { EventsHub } from '../../backend/services/events.hub';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private timer: NodeJS.Timer | undefined;

  private readonly player: PlayerInterface;

  private currentScene!: SceneDefinition;

  private actionReactives: { [key: string]: InteractiveInterface };

  private actors: ArrayView<ActorInterface>;

  private readonly dodgedThisRound: Map<string, number>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly ruleDispatcherService: RulesHub,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService,
    private readonly eventHub: EventsHub,
    inventoryService: InventoryService
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

    this.eventHub.actorDodged$.subscribe((actorId) => {
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
      eventHub.logMessageProduced$,
      characterService.characterChanged$,
      inventoryChanged,
      this.eventHub.documentOpened$,
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
      (map: { [key: string]: InteractiveInterface }, i) => {
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
      return createActionableDefinition('READ', 'read', 'Read');
    }

    return createActionableDefinition('NOOP', 'noop', 'NOOP');
  }
}
