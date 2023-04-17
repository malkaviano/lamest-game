import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '../../../backend/events/actionable.event';
import { CharacterValuesView } from '../../../backend/view-models/character-values.view';
import { ActionableItemView } from '../../../backend/view-models/actionable-item.view';

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
