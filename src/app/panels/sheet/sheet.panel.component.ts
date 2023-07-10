import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@events/actionable.event';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';

@Component({
  selector: 'app-sheet-panel',
  templateUrl: './sheet.panel.component.html',
  styleUrls: ['./sheet.panel.component.css'],
})
export class SheetPanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() characterValues!: CharacterValuesView;

  @Input() inventory!: ActionableItemDefinition[];

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
