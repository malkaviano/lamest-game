import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { SelectedActionEvent } from '../../events/selected-action.event';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css'],
})
export class InteractiveComponent {
  @Input() interactive!: InteractiveEntity;
  @Output() onActionSelected: EventEmitter<SelectedActionEvent>;

  constructor() {
    this.onActionSelected = new EventEmitter<SelectedActionEvent>();
  }

  actionSelected(id: string): void {
    this.onActionSelected.emit(
      new SelectedActionEvent(id, this.interactive.id)
    );
  }
}
