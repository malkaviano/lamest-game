import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { ActionableItemView } from '../../view-models/actionable-item.view';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { ArrayView } from '../../view-models/array.view';
import { CharacterStatusView } from '../../view-models/character-status.view';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent implements OnChanges {
  color: ThemePalette = 'accent';

  disabled = true;

  characterStatus!: CharacterStatusView;

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

  ngOnChanges(): void {
    this.updateStatus();
  }

  private updateStatus(): void {
    this.characterStatus = CharacterStatusView.create(
      this.characterValues.derivedAttributes,
      this.equipped,
      this.characterValues.identity.items[6].value
    );
  }
}
