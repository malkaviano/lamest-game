import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { ActionableEvent } from '../../events/actionable.event';
import { ArrayView } from '../../views/array.view';

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
