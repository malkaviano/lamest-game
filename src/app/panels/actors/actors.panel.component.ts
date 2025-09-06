import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-actors-panel',
  templateUrl: './actors.panel.component.html',
  styleUrls: ['./actors.panel.component.css']
})
export class ActorsPanelComponent {
  @Input() public panelName!: string;

  @Input() public interactives!: ArrayView<InteractiveInterface>;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public get actorInteractives(): ArrayView<InteractiveInterface> {
    return this.interactives.filter(interactive => 
      interactive.classification === 'ACTOR'
    );
  }

  public get hasActors(): boolean {
    return this.actorInteractives.items.length > 0;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onActionSelected(event: ActionableEvent): void {
    this.actionSelected.emit(event);
  }
}