import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
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

  @Input() characterValues!: CharacterValuesDefinition;

  @Input() inventory!: ActionableItemDefinition[];

  @Input() equipped!: GameItemDefinition | null;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
