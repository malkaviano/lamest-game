import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CharacterValuesView } from '../../view-models/character-values.view';
import { ActionableItemView } from '../../view-models/actionable-item.view';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-sheet-panel',
  templateUrl: './sheet.panel.component.html',
  styleUrls: ['./sheet.panel.component.css'],
})
export class SheetPanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() characterValues!: CharacterValuesView;

  @Input() inventory!: ActionableItemView[];

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
