import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { ActionableDefinition } from '../../../core/definitions/actionable.definition';
import { ActionableEvent } from '../../../core/events/actionable.event';
import { ArrayView } from '../../../core/view-models/array.view';
import { InteractiveInterface } from '../../../core/interfaces/interactive.interface';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameStringsStore } from '../../../stores/game-strings.store';

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

  public readonly aggressiveTooltip: String;
  public readonly retaliateTooltip: String;
  public readonly playerTooltip: String;
  public readonly searchTooltip: String;
  public readonly visibilityTooltip: String;

  constructor(private readonly withSubscriptionHelper: WithSubscriptionHelper) {
    this.actionSelected = new EventEmitter<ActionableEvent>();
    this.actions = ArrayView.create([]);

    this.aggressiveTooltip = GameStringsStore.tooltips['aggressive'];
    this.retaliateTooltip = GameStringsStore.tooltips['retaliate'];
    this.playerTooltip = GameStringsStore.tooltips['retaliate'];
    this.searchTooltip = GameStringsStore.tooltips['search'];
    this.visibilityTooltip = GameStringsStore.tooltips['visibility'];
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
