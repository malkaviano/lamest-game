import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-inventory-panel',
  templateUrl: './inventory.panel.component.html',
  styleUrls: ['./inventory.panel.component.css'],
})
export class InventoryPanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() inventory: ActionableItemDefinition[];

  @Input() equipped!: GameItemDefinition;

  @Input() panelName: string;

  constructor() {
    this.panelName = '';

    this.inventory = [];

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
