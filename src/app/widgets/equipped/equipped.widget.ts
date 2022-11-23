import { Component, EventEmitter, Input, Output } from '@angular/core';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-equipped-widget',
  templateUrl: './equipped.widget.html',
  styleUrls: ['./equipped.widget.css'],
})
export class EquippedWidget {
  @Input() equipped: GameItemDefinition | null;
  @Output() onActionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.equipped = null;

    this.onActionSelected = new EventEmitter<ActionableEvent>();
  }

  actionSelected(item: GameItemDefinition): void {
    this.onActionSelected.emit(
      new ActionableEvent(
        createActionableDefinition('UNEQUIP', 'unequip', item.label),
        item.name
      )
    );
  }
}
