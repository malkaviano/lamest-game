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
  actions: ArrayView<ActionableDefinition> = new ArrayView([]);

  constructor() {
    this.onActionSelected = new EventEmitter<ActionableDefinition>();
    this.actionsSubscription = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.actionsSubscription = this.interactive.stateChanged$.subscribe(
      (actions) => {
        this.actions = actions;
      }
    );
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  actionSelected(id: ActionableLiteral): void {
    this.onActionSelected.emit(actionableDefinitions[id]);
  }
}
