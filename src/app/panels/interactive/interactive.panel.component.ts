import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '../../../backend/events/actionable.event';
import { InteractiveEntity } from '../../../backend/entities/interactive.entity';
import { ArrayView } from '../../../backend/view-models/array.view';

@Component({
  selector: 'app-interactive-panel',
  templateUrl: './interactive.panel.component.html',
  styleUrls: ['./interactive.panel.component.css'],
})
export class InteractivePanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() public panelName: string;

  @Input() public interactives: ArrayView<InteractiveEntity>;

  constructor() {
    this.panelName = '';

    this.interactives = ArrayView.create([]);

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }
}
