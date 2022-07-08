import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Interactive } from '../definitions/interactive.definition';
import { SelectedAction } from '../definitions/selected-action.definition';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css'],
})
export class InteractiveComponent {
  @Input() interactive!: Interactive;
  @Output() onActionSelected: EventEmitter<SelectedAction>;

  constructor() {
    this.onActionSelected = new EventEmitter<SelectedAction>();
  }

  actionSelected(id: string): void {
    this.onActionSelected.emit(new SelectedAction(id, this.interactive.id));
  }
}
