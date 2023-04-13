import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemView } from '../../view-models/actionable-item.view';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-inventory-panel',
  templateUrl: './inventory.panel.component.html',
  styleUrls: ['./inventory.panel.component.css'],
})
export class InventoryPanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() inventory: ActionableItemView[];

  @Input() panelName: string;

  constructor() {
    this.panelName = '';

    this.inventory = [];

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
