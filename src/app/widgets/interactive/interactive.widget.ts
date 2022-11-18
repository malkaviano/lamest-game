import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ArrayView } from '../../definitions/array-view.definition';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.html',
  styleUrls: ['./interactive.widget.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidget implements OnInit, OnDestroy {
  @Input() interactive!: InteractiveEntity;
  @Output() onActionSelected: EventEmitter<ActionableDefinition>;
  actions: ArrayView<ActionableDefinition>;

  constructor(private readonly withSubscriptionHelper: WithSubscriptionHelper) {
    this.onActionSelected = new EventEmitter<ActionableDefinition>();
    this.actions = new ArrayView([]);
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.interactive.actionsChanged$.subscribe((actions) => {
        this.actions = actions;
      })
    );
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  actionSelected(action: ActionableDefinition): void {
    this.onActionSelected.emit(action);
  }
}
