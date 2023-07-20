import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CharacterStatusView } from '../../view-models/character-status.view';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ViewableInterface } from '../../interfaces/viewable.interface';
import { SceneEntity } from '@entities/scene.entity';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent {
  color: ThemePalette = 'accent';

  disabled = true;

  @Input() characterStatus!: CharacterStatusView;

  @Input() logs!: ArrayView<string>;

  @Input() scene!: SceneEntity;

  @Input() characterValues!: CharacterValuesView;

  @Input() inventory!: ActionableItemDefinition[];

  @Input() equipped!: GameItemDefinition;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Output() sceneOpened: EventEmitter<ViewableInterface>;

  @Output() dodgeOption: EventEmitter<{ dodge: boolean }>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.sceneOpened = new EventEmitter<ViewableInterface>();

    this.dodgeOption = new EventEmitter<{ dodge: boolean }>();
  }
}
