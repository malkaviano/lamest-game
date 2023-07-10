import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@conceptual/events/actionable.event';
import { CharacterValuesView } from '@conceptual/view-models/character-values.view';
import { ActionableItemView } from '@conceptual/view-models/actionable-item.view';

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
