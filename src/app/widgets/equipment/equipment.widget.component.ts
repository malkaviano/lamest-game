import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableItemView } from '../../model-views/actionable-item.view';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ActionableEvent } from '../../events/actionable.event';

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
