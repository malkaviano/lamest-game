import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActionableDefinition } from '../definitions/actionable.definition';

import { Scene } from '../definitions/scene.definition';
import { GameManagerService } from '../game-manager.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css'],
})
export class MainPanelComponent implements OnInit, OnDestroy {
  scene!: Scene;

  sceneChangedSubscription: Subscription;

  playerActionSubscription: Subscription;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly gameManager: GameManagerService
  ) {
    this.sceneChangedSubscription = Subscription.EMPTY;
    this.playerActionSubscription = Subscription.EMPTY;
  }

  ngOnDestroy(): void {
    this.sceneChangedSubscription.unsubscribe();
    this.playerActionSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.sceneChangedSubscription = this.gameManager.sceneChanged$.subscribe(
      (scene) => (this.scene = scene)
    );

    this.playerActionSubscription = this.gameManager.playerAction$.subscribe(
      (action) =>
        this.snackBar.open(action.label, 'dismiss', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        })
    );
  }

  actionSelected(event: ActionableDefinition): void {
    this.gameManager.registerEvent(event);
  }
}
