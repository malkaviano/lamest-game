import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';

@Component({
  selector: 'app-interactive-panel',
  templateUrl: './interactive.panel.component.html',
  styleUrls: ['./interactive.panel.component.css'],
})
export class InteractivePanelComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() public panelName: string;

  @Input() public interactives: ArrayView<InteractiveInterface>;

  constructor() {
    this.panelName = '';

    this.interactives = ArrayView.empty();

    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  public get nonTravelInteractives(): ArrayView<InteractiveInterface> {
    return this.interactives.filter(interactive => 
      !interactive.actions.items.some(action => action.actionable === 'SCENE')
    );
  }
}
