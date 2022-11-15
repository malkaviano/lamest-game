import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ActionableDefinition,
  actionableDefinitions,
} from '../../definitions/actionable.definition';
import { ArrayView } from '../../definitions/array-view.definition';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { ActionableLiteral } from '../../literals/actionable.literal';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css'],
})
export class InteractiveComponent implements OnInit, OnDestroy {
  private actionsSubscription: Subscription;

  @Input() interactive!: InteractiveEntity;
  @Output() onActionSelected: EventEmitter<ActionableDefinition>;
  actions: ArrayView<ActionableDefinition>;

  constructor() {
    this.onActionSelected = new EventEmitter<ActionableDefinition>();
    this.actionsSubscription = Subscription.EMPTY;
    this.actions = new ArrayView([]);
  }

  ngOnInit(): void {
    this.actionsSubscription = this.interactive.actionsChanged$.subscribe(
      (actions) => {
        this.actions = actions;
      }
    );
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  actionSelected(action: ActionableDefinition): void {
    this.onActionSelected.emit(action);
  }
}
