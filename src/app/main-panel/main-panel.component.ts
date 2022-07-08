import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Scene } from '../definitions/scene.definition';
import { SelectedAction } from '../definitions/selected-action.definition';
import { GameManagerService } from '../game-manager.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css'],
})
export class MainPanelComponent implements OnInit {
  scene: Scene;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly gameManager: GameManagerService
  ) {
    this.scene = gameManager.currentScene;
  }

  ngOnInit(): void {
    /* TODO document why this method 'ngOnInit' is empty */
  }

  actionSelected(event: SelectedAction): void {
    this.scene.registerEvent(event);

    this.snackBar.open(event.id, 'dismiss', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
