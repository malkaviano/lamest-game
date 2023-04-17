import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '../../../backend/events/actionable.event';
import { ActionableItemView } from '../../../backend/view-models/actionable-item.view';
import { ActionableDefinition } from '../../../backend/definitions/actionable.definition';

@Component({
  selector: 'app-equipment-widget',
  templateUrl: './equipment.widget.component.html',
  styleUrls: ['./equipment.widget.component.css'],
})
export class EquipmentWidgetComponent {
  @Input() equipment!: ActionableItemView;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(
      new ActionableEvent(action, this.equipment.item.identity.name)
    );
  }
}
