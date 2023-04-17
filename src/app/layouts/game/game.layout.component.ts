import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CharacterStatusView } from '../../../core/view-models/character-status.view';
import { ActionableEvent } from '../../../core/events/actionable.event';
import { ArrayView } from '../../../core/view-models/array.view';
import { SceneDefinition } from '../../../core/definitions/scene.definition';
import { CharacterValuesView } from '../../../core/view-models/character-values.view';
import { ActionableItemView } from '../../../core/view-models/actionable-item.view';
import { GameItemDefinition } from '../../../core/definitions/game-item.definition';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent {
  color: ThemePalette = 'accent';

  disabled = true;

  @Input() characterStatus!: CharacterStatusView;

  @Input() canAct = true;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() logs!: ArrayView<string>;

  @Input() scene!: SceneDefinition;

  @Input() characterValues!: CharacterValuesView;

  @Input() inventory!: ActionableItemView[];

  @Input() equipped!: GameItemDefinition;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
