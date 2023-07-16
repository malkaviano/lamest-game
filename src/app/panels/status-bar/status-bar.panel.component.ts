import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';
import { ActionableEvent } from '@events/actionable.event';
import {
  stripActionable,
  unequipActionable,
} from '@definitions/actionable.definition';

@Component({
  selector: 'app-status-bar-panel',
  templateUrl: './status-bar.panel.component.html',
  styleUrls: ['./status-bar.panel.component.css'],
})
export class StatusBarPanelComponent {
  @Input() status!: CharacterStatusView;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  onActionSelected(action: string): void {
    if (action === 'unequip') {
      this.actionSelected.emit(
        new ActionableEvent(unequipActionable, this.status.weapon.identity.name)
      );
    } else if (action === 'strip') {
      this.actionSelected.emit(
        new ActionableEvent(stripActionable, this.status.armor.identity.name)
      );
    }
  }
}
