import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-reactives-panel',
  templateUrl: './reactives.panel.component.html',
  styleUrls: ['./reactives.panel.component.css'],
})
export class ReactivesPanelComponent {
  @Input() public panelName!: string;

  @Input() public reactives!: ArrayView<InteractiveInterface>;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public get hasReactives(): boolean {
    return this.reactives.items.length > 0;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onActionSelected(event: ActionableEvent): void {
    this.actionSelected.emit(event);
  }
}
