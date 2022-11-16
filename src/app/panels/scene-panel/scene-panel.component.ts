import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

import { SceneEntity } from '../../entities/scene.entity';
import { GameManagerService } from '../../game-manager.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

@Component({
  selector: 'app-scene-panel',
  templateUrl: './scene-panel.component.html',
  styleUrls: ['./scene-panel.component.css'],
})
export class ScenePanelComponent implements OnInit, OnDestroy {
  scene!: SceneEntity;

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

  keyValues: KeyValueDescriptionDefinition[] = [
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
    new KeyValueDescriptionDefinition(
      'GGGGGGGGGG',
      '10',
      'Omg it is going to happen'
    ),
  ];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly gameManager: GameManagerService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper
  ) {}

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameManager.sceneChanged$.subscribe((scene) => (this.scene = scene))
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManager.playerAction$.subscribe((action) =>
        this.snackBar.open(action.label, 'dismiss', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        })
      )
    );

    this.withSubscriptionHelper.addSubscriptions(
      this.scene.interactives.map((i) => {
        return i.logMessageProduced$.subscribe((log) => {
          const strLog = `${log.action.label} => ${log.response}`;

          this.scene.addLog(strLog);
        });
      })
    );
  }

  actionSelected(action: ActionableDefinition): void {
    this.scene.interactives
      .filter((i) => i.id === action.interactiveId)
      .forEach((i) => i.onActionSelected(action));

    this.gameManager.registerEvent(action);
  }
}
