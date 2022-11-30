import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-equipment-widget',
  templateUrl: './equipment.widget.component.html',
  styleUrls: ['./equipment.widget.component.css'],
})
export class EquipmentWidgetComponent {
  @Input() equipment!: ActionableItemDefinition;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(
      new ActionableEvent(action, this.equipment.item.name)
    );
  }
}
