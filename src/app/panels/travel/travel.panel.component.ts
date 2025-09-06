import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-travel-panel',
  templateUrl: './travel.panel.component.html',
  styleUrls: ['./travel.panel.component.css']
})
export class TravelPanelComponent {
  @Input() public panelName!: string;

  @Input() public interactives!: ArrayView<InteractiveInterface>;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public get travelInteractives(): ArrayView<InteractiveInterface> {
    return this.interactives.filter(interactive => 
      interactive.actions.items.some(action => action.actionable === 'SCENE')
    );
  }

  public get hasTravelOptions(): boolean {
    return this.travelInteractives.items.length > 0;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onActionSelected(event: ActionableEvent): void {
    this.actionSelected.emit(event);
  }
}