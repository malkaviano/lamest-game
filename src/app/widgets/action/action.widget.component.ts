import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@events/actionable.event';

@Component({
  selector: 'app-action-widget',
  templateUrl: './action.widget.component.html',
  styleUrls: ['./action.widget.component.css'],
})
export class ActionWidgetComponent {
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Input() icon!: string;

  @Input() alt!: string;

  @Input() action!: ActionableEvent;

  @Input() tooltip!: string;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();
  }

  onActionSelected(): void {
    this.actionSelected.emit(this.action);
  }
}
