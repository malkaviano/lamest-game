import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { ActorInterface } from '../../../backend/interfaces/actor.interface';

@Component({
  selector: 'app-actors-panel',
  templateUrl: './actors.panel.component.html',
  styleUrls: ['./actors.panel.component.css'],
})
export class ActorsPanelComponent {
  @Input() public panelName!: string;

  @Input() public actors!: ArrayView<ActorInterface>;

  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public get hasActors(): boolean {
    return this.actors.items.length > 0;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onActionSelected(event: ActionableEvent): void {
    this.actionSelected.emit(event);
  }
}
