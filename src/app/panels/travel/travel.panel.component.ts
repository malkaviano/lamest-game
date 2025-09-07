import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-travel-panel',
  templateUrl: './travel.panel.component.html',
  styleUrls: ['./travel.panel.component.css'],
})
export class TravelPanelComponent {
  @Input() public panelName!: string;

  @Input() public travels!: ArrayView<InteractiveInterface>;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public get hasTravelOptions(): boolean {
    return this.travels.items.length > 0;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onActionSelected(event: ActionableEvent): void {
    this.actionSelected.emit(event);
  }
}
