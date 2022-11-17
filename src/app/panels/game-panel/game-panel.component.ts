import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActionableDefinition } from '../../definitions/actionable.definition';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { GameManagerService } from '../../game-manager.service';
import { ConverterHelper } from '../../helpers/converter.helper';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

@Component({
  selector: 'app-game-panel',
  templateUrl: './game-panel.component.html',
  styleUrls: ['./game-panel.component.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePanelComponent implements OnInit, OnDestroy {
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
    private readonly snackBar: MatSnackBar,
    private readonly gameManager: GameManagerService,
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
      this.gameManager.characterChanged$.subscribe((character) => {
        this.characterValues =
          this.converterHelper.characterToKeyValueDescription(character);
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManager.sceneChanged$.subscribe((scene) => (this.scene = scene))
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManager.playerActed$.subscribe((action) =>
        this.snackBar.open(action.label, 'dismiss', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        })
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManager.actionLogged$.subscribe((log) => {
        this.logs.unshift(log);
      })
    );
  }

  actionSelected(action: ActionableDefinition): void {
    this.gameManager.registerEvent(action);
  }
}
