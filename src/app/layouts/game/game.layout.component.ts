import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemView } from '../../views/actionable-item.view';
import { CharacterValuesView } from '../../views/character-values.view';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent {
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
