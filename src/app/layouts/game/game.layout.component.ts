import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CharacterStatusView } from '@conceptual/view-models/character-status.view';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { ArrayView } from '@conceptual/view-models/array.view';
import { SceneDefinition } from '@conceptual/definitions/scene.definition';
import { CharacterValuesView } from '@conceptual/view-models/character-values.view';
import { ActionableItemView } from '@conceptual/view-models/actionable-item.view';
import { GameItemDefinition } from '@conceptual/definitions/game-item.definition';
import { ViewableInterface } from '@conceptual/interfaces/viewable.interface';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent {
  color: ThemePalette = 'accent';

  disabled = true;

  @Input() characterStatus!: CharacterStatusView;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() logs!: ArrayView<string>;

  @Input() scene!: SceneDefinition;

  @Input() characterValues!: CharacterValuesView;

  @Input() inventory!: ActionableItemView[];

  @Input() equipped!: GameItemDefinition;

  @Output() sceneOpened: EventEmitter<ViewableInterface>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.sceneOpened = new EventEmitter<ViewableInterface>();
  }
}
