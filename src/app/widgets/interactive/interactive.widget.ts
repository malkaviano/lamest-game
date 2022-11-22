import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ArrayView } from '../../views/array.view';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.html',
  styleUrls: ['./interactive.widget.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidget implements OnInit, OnDestroy {
  @Input() interactive!: InteractiveEntity;
  @Output() onActionSelected: EventEmitter<ActionableEvent>;
  actions: ArrayView<ActionableDefinition>;

  constructor(private readonly withSubscriptionHelper: WithSubscriptionHelper) {
    this.onActionSelected = new EventEmitter<ActionableEvent>();
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
    this.onActionSelected.emit(
      new ActionableEvent(action, this.interactive.id)
    );
  }
}
