import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';
import { ActionableEvent } from '@events/actionable.event';

@Component({
  selector: 'app-status-bar-panel',
  templateUrl: './status-bar.panel.component.html',
  styleUrls: ['./status-bar.panel.component.css'],
})
export class StatusBarPanelComponent {
  @Input() status!: CharacterStatusView;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Output() dodgeOption: EventEmitter<{ dodge: boolean }>;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.dodgeOption = new EventEmitter<{ dodge: boolean }>();
  }

  onChange(dodge: boolean) {
    this.dodgeOption.emit({ dodge });
  }
}
