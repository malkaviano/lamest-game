import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-travel-widget',
  templateUrl: './travel.widget.component.html',
  styleUrls: ['./travel.widget.component.css']
})
export class TravelWidgetComponent {
  @Input() public interactive!: InteractiveInterface;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public get actions(): ArrayView<ActionableDefinition> {
    return this.interactive.actions.filter(action => action.actionable === 'SCENE');
  }

  public onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(new ActionableEvent(action, this.interactive.id));
  }

  public get hasSceneActions(): boolean {
    return this.actions.items.length > 0;
  }
}