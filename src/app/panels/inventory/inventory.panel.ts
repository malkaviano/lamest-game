import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-inventory-panel',
  templateUrl: './inventory.panel.html',
  styleUrls: ['./inventory.panel.css'],
})
export class InventoryPanel {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() inventory: ActionableItemDefinition[];

  @Input() equipped: GameItemDefinition | null;

  @Input() panelName: string;

  constructor() {
    this.panelName = '';

    this.equipped = null;

    this.inventory = [];

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
