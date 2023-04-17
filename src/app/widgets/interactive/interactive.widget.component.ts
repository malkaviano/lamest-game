import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { WithSubscriptionHelper } from '../../../backend/helpers/with-subscription.helper';
import { ActionableDefinition } from '../../../core/definitions/actionable.definition';
import { ActionableEvent } from '../../../core/events/actionable.event';
import { ArrayView } from '../../../core/view-models/array.view';
import { InteractiveInterface } from '../../../core/interfaces/interactive.interface';

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.component.html',
  styleUrls: ['./interactive.widget.component.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidgetComponent implements OnInit, OnDestroy {
  @Input() interactive!: InteractiveInterface;
  @Output() actionSelected: EventEmitter<ActionableEvent>;
  actions: ArrayView<ActionableDefinition>;

  constructor(private readonly withSubscriptionHelper: WithSubscriptionHelper) {
    this.actionSelected = new EventEmitter<ActionableEvent>();
    this.actions = ArrayView.create([]);
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

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(new ActionableEvent(action, this.interactive.id));
  }
}
