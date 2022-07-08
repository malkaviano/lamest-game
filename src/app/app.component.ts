import { Component, OnInit } from '@angular/core';
import { Interactive } from './definitions/interactive.definition';
import { ActionSelection } from './definitions/action-selection.definition';
import { SelectedAction } from './definitions/selected-action.definition';
import { GameManagerService } from './game-manager.service';
import { Scene } from './definitions/scene.definition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'lamest-game';

  scene: Scene;

  constructor(private readonly gameManager: GameManagerService) {
    this.scene = gameManager.currentScene;
  }

  ngOnInit(): void {
    /* TODO document why this method 'ngOnInit' is empty */
  }

  actionSelected(event: SelectedAction): void {
    this.scene.registerEvent(event);
  }
}
