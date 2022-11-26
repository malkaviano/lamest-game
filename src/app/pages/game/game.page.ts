import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { ConverterHelper } from '../../helpers/converter.helper';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameManagerService } from '../../services/game-manager.service';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePage implements OnInit, OnDestroy {
  private readonly gameLogs: string[];

  public scene: SceneDefinition;

  public characterValues: CharacterValuesDefinition;

  public inventory: ActionableItemDefinition[];

  public equipped: GameItemDefinition | null;

  constructor(
    private readonly gameManagerService: GameManagerService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly converterHelper: ConverterHelper
  ) {
    this.gameLogs = [];

    this.inventory = [];

    this.equipped = null;

    this.characterValues = new CharacterValuesDefinition(
      new ArrayView([]),
      new ArrayView([]),
      new ArrayView([]),
      new ArrayView([])
    );

    this.scene = new SceneDefinition(new ArrayView([]), new ArrayView([]));
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.characterChanged$.subscribe(
        (character) => {
          this.characterValues =
            this.converterHelper.characterToKeyValueDescription(character);
        }
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.sceneChanged$.subscribe(
        (scene) => (this.scene = scene)
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.actionLogged$.subscribe((log) => {
        this.gameLogs.unshift(log);
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.playerInventory$.subscribe((inventory) => {
        this.inventory = inventory.items.items;
        this.equipped = inventory.equipped;
      })
    );
  }

  informActionSelected(action: ActionableEvent): void {
    this.gameManagerService.actionableReceived(action);
  }

  public get logs(): ArrayView<string> {
    return new ArrayView(this.gameLogs);
  }
}
