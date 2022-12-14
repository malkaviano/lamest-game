import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionableItemView } from '../../views/actionable-item.view';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { ConverterHelper } from '../../helpers/converter.helper';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameBridgeService } from '../../services/game-bridge.service';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.component.html',
  styleUrls: ['./game.page.component.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePageComponent implements OnInit, OnDestroy {
  private readonly gameLogs: string[];

  public scene: SceneDefinition;

  public characterValues: CharacterValuesDefinition;

  public inventory: ActionableItemView[];

  public equipped!: GameItemDefinition;

  constructor(
    private readonly gameManagerService: GameBridgeService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly converterHelper: ConverterHelper
  ) {
    this.gameLogs = [];

    this.inventory = [];

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
          this.equipped = character.weaponEquipped;
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
        this.gameLogs.unshift(log.toString());
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.playerInventory$.subscribe((inventory) => {
        this.inventory = inventory.items;
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
