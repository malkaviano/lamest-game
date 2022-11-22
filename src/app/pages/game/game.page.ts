import { Component, OnDestroy, OnInit } from '@angular/core';

import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
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

  scene!: SceneDefinition;

  characterValues!: CharacterValuesDefinition;

  inventory!: KeyValueDescriptionDefinition[];

  constructor(
    private readonly gameManagerService: GameManagerService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly converterHelper: ConverterHelper
  ) {
    this.gameLogs = [];
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
        this.inventory = inventory.items.map((i) => {
          return new KeyValueDescriptionDefinition(
            i.item.name,
            i.item.label,
            i.item.description
          );
        });
      })
    );
  }

  actionSelected(action: ActionableEvent): void {
    this.gameManagerService.events.registerActionableTaken(action);
  }

  public get logs(): ArrayView<string> {
    return new ArrayView(this.gameLogs);
  }
}
