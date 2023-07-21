import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { SceneEntity } from '@entities/scene.entity';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { ViewableInterface } from '../../interfaces/viewable.interface';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { CharacterValuesView } from '../../view-models/character-values.view';

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

  @Output() playerOptions: EventEmitter<{
    readonly dodge?: boolean;
    readonly visible?: boolean;
  }>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.sceneOpened = new EventEmitter<ViewableInterface>();

    this.playerOptions = new EventEmitter();
  }
}
