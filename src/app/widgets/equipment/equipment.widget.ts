import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-equipment-widget',
  templateUrl: './equipment.widget.html',
  styleUrls: ['./equipment.widget.css'],
})
export class EquipmentWidget {
  @Input() equipment!: ActionableItemDefinition;
  @Output() onActionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.onActionSelected = new EventEmitter<ActionableEvent>();
  }

  actionSelected(action: ActionableDefinition): void {
    this.onActionSelected.emit(
      new ActionableEvent(action, this.equipment.item.name)
    );
  }
}
