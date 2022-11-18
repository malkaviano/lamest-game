import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionableDefinition } from '../../definitions/actionable.definition';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ConverterHelper } from '../../helpers/converter.helper';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameManagerService } from '../../services/game-manager.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePage implements OnInit, OnDestroy {
  scene!: SceneDefinition;

  inventory: KeyValueDescriptionDefinition[] = [
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'SomeItemGG',
      '+10 to Damage BRILLIANT!!!',
      'Omg it is going to happen'
    ),
  ];

  characterValues!: CharacterValuesDefinition;

  public readonly logs: string[];

  constructor(
    private readonly gameManagerService: GameManagerService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly converterHelper: ConverterHelper
  ) {
    this.logs = [];
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.characterChanged$.subscribe((character) => {
        this.characterValues =
          this.converterHelper.characterToKeyValueDescription(character);
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.sceneChanged$.subscribe(
        (scene) => (this.scene = scene)
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.actionLogged$.subscribe((log) => {
        this.logs.unshift(log);
      })
    );
  }

  actionSelected(action: ActionableDefinition): void {
    this.gameManagerService.registerEvent(action);
  }
}
