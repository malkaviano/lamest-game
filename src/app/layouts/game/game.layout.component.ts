import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { ActionableItemView } from '../../model-views/actionable-item.view';
import { CharacterValuesView } from '../../model-views/character-values.view';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { ArrayView } from '../../model-views/array.view';
import { CharacterStatusView } from '../../model-views/character-status';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.component.html',
  styleUrls: ['./game.layout.component.css'],
})
export class GameLayoutComponent implements OnChanges, OnInit {
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

  ngOnInit(): void {
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
