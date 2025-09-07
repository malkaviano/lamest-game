import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-actor-widget',
  templateUrl: './actor.widget.component.html',
  styleUrls: ['./actor.widget.component.css']
})
export class ActorWidgetComponent {
  @Input() public interactive!: InteractiveInterface;
  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public get actions(): ArrayView<ActionableDefinition> {
    return this.interactive.actions;
  }

  public get hasActions(): boolean {
    return this.actions.items.length > 0;
  }

  public get isActor(): boolean {
    return this.interactive.classification === 'ACTOR';
  }

  public onActionSelected(action: ActionableDefinition): void {
    const event = new ActionableEvent(action, this.interactive.id);
    this.actionSelected.emit(event);
  }
}