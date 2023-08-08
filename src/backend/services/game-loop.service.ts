import { filter, map } from 'rxjs';

import { CharacterService } from '@services/character.service';
import { NarrativeService } from '@services/narrative.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { RulesHub } from '@hubs/rules.hub';
import { InventoryService } from '@services/inventory.service';
import {
  ActionableDefinition,
  consumeActionable,
  dropActionable,
  equipActionable,
  readActionable,
  wearActionable,
} from '@definitions/actionable.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ActionableEvent } from '@events/actionable.event';
import { PlayerInterface } from '@interfaces/player.interface';
import { ActorEntity } from '@entities/actor.entity';
import { PolicyHub } from '@hubs/policy.hub';
import { LoggingHub } from '@hubs/logging.hub';
import { GamePredicate } from '@predicates/game.predicate';
import { SettingsStore } from '@stores/settings.store';
import { SceneActorsInfoValues } from '@values/scene-actors.value';
import { SceneEntity } from '@entities/scene.entity';
import { GameEventsValues } from '@values/game-events.value';
import { TimerHelper } from '@helpers/timer.helper';

export class GameLoopService {
  private readonly player: PlayerInterface;

  private currentScene!: SceneEntity;

  private interactives: { [key: string]: InteractiveInterface };

  private actors: ArrayView<ActorInterface>;

  public readonly events: GameEventsValues;

  constructor(
    private readonly ruleHub: RulesHub,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService,
    private readonly policyHub: PolicyHub,
    private readonly gamePredicate: GamePredicate,
    inventoryService: InventoryService,
    loggingHub: LoggingHub,
    private readonly timerHelper: TimerHelper
  ) {
    this.player = this.characterService.currentCharacter;

    this.interactives = {};

    this.actors = ArrayView.empty();

    this.narrativeService.sceneChanged$.subscribe((scene) => {
      this.currentScene = scene;

      this.setInteractives();

      this.setActors();
    });

    const inventoryChanged = inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === this.player.id),
      map(() => {
        const items = this.playerInventory(inventoryService);

        return items;
      })
    );

    this.events = new GameEventsValues(
      narrativeService.sceneChanged$,
      loggingHub.logMessageProduced$,
      characterService.characterChanged$,
      inventoryChanged,
      this.ruleHub.documentOpened$
    );
  }

  public start(): void {
    this.timerHelper.createInterval(
      'aiTimer',
      () => this.run(this.actors),
      SettingsStore.settings.aiLoopMilliseconds
    );

    this.timerHelper.createInterval(
      'playerTimer',
      () => this.run(ArrayView.create(this.player)),
      250
    );
  }

  public stop(): void {
    this.timerHelper.intervals.items.forEach((key) => {
      this.timerHelper.removeInterval(key);
    });
  }

  public actionableReceived(action: ActionableEvent): void {
    this.player.playerDecision(action);
  }

  public actorDodge(option: boolean): void {
    this.player.dodge = option;
  }

  public becomeVisible(): void {
    this.player.changeVisibility('VISIBLE');
  }

  private run(actors: ArrayView<ActorInterface>): void {
    if (this.isPlayerAlive()) {
      actors.items.forEach((actor) => {
        const actionableEvent = actor.action(this.sceneActorsInfo());

        if (actor.situation === 'ALIVE' && actionableEvent) {
          const rule =
            this.ruleHub.dispatcher[
              actionableEvent.actionableDefinition.actionable
            ];

          if (this.gamePredicate.hasEnoughActionPoints(actor, rule)) {
            const target = this.interactives[actionableEvent.eventId];

            const result = rule.execute(actor, actionableEvent, {
              target,
            });

            this.policyHub.enforcePolicies(
              result,
              actionableEvent.actionableDefinition,
              this.invisibleInteractives()
            );
          }
        }
      });
    }
  }

  private isPlayerAlive(): boolean {
    return this.player.situation === 'ALIVE';
  }

  private setInteractives(): void {
    this.interactives = this.currentScene.interactives.items.reduce(
      (map: { [key: string]: InteractiveInterface }, i) => {
        map[i.id] = i;

        return map;
      },
      {}
    );

    this.interactives[this.player.id] = this.player;
  }

  private setActors(): void {
    const actors: ActorInterface[] = [];

    this.currentScene.interactives.items.forEach((interactive) => {
      if (interactive instanceof ActorEntity) {
        actors.push(interactive);
      }
    });

    this.actors = ArrayView.fromArray(actors);
  }

  private sceneActorsInfo(): ArrayView<SceneActorsInfoValues> {
    return ArrayView.fromArray(
      this.actors.insert(this.player).items.map((a) => {
        return {
          id: a.id,
          situation: a.situation,
          classification: a.classification,
          visibility: a.visibility,
        };
      })
    );
  }

  private playerInventory(
    inventoryService: InventoryService
  ): ArrayView<ActionableItemDefinition> {
    const playerItems = inventoryService.list(this.player.id);

    const inventoryView: ActionableItemDefinition[] = [];

    const items = playerItems.items.reduce((acc, itemStorage) => {
      for (let index = 0; index < itemStorage.quantity; index++) {
        acc.push(
          new ActionableItemDefinition(
            itemStorage.item,
            this.inventoryAction(itemStorage.item)
          )
        );
      }

      return acc;
    }, inventoryView);

    return ArrayView.fromArray(items);
  }

  private inventoryAction(item: GameItemDefinition): ActionableDefinition {
    switch (item.category) {
      case 'WEAPON':
        return equipActionable;
      case 'CONSUMABLE':
        return consumeActionable;
      case 'READABLE':
        return readActionable;
      case 'ARMOR':
        return wearActionable;
      default:
        return dropActionable;
    }
  }

  private invisibleInteractives(): ArrayView<InteractiveInterface> {
    return this.currentScene.interactives.filter(
      (i) => i.visibility !== 'VISIBLE'
    );
  }
}
