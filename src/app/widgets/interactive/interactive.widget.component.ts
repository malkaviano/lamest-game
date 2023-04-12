import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActionableDefinition } from '../../definitions/actionable.definition';
import { ArrayView } from '../../model-views/array.view';

import { InteractiveEntity } from '../../entities/interactive.entity';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { ActionableEvent } from '../../events/actionable.event';

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.component.html',
  styleUrls: ['./interactive.widget.component.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidgetComponent implements OnInit, OnDestroy {
  @Input() interactive!: InteractiveEntity;
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
