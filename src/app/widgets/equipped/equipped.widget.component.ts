import { Component, EventEmitter, Input, Output } from '@angular/core';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-equipped-widget',
  templateUrl: './equipped.widget.component.html',
  styleUrls: ['./equipped.widget.component.css'],
})
export class EquippedWidgetComponent {
  @Input() equipped: GameItemDefinition | null;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.equipped = null;

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  onActionSelected(item: GameItemDefinition): void {
    this.actionSelected.emit(
      new ActionableEvent(
        createActionableDefinition('UNEQUIP', 'unequip', item.label),
        item.name
      )
    );
  }
}
