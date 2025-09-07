import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-reactive-widget',
  templateUrl: './reactive.widget.component.html',
  styleUrls: ['./reactive.widget.component.css']
})
export class ReactiveWidgetComponent {
  @Input() public interactive!: InteractiveInterface;
  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public get actions(): ArrayView<ActionableDefinition> {
    return this.interactive.actions;
  }

  public get hasActions(): boolean {
    return this.actions.items.length > 0;
  }

  public get isReactive(): boolean {
    return this.interactive.classification === 'REACTIVE';
  }

  public onActionSelected(action: ActionableDefinition): void {
    const event = new ActionableEvent(action, this.interactive.id);
    this.actionSelected.emit(event);
  }
}