import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableLiteral } from '@literals/actionable.literal';

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.component.html',
  styleUrls: ['./interactive.widget.component.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidgetComponent implements OnInit, OnDestroy {
  private readonly basePath: string;

  @Input() interactive!: InteractiveInterface;
  @Output() actionSelected: EventEmitter<ActionableEvent>;
  actions: ArrayView<ActionableDefinition>;

  public readonly aggressiveTooltip: string;
  public readonly retaliateTooltip: string;
  public readonly playerTooltip: string;
  public readonly searchTooltip: string;
  public readonly visibilityTooltip: string;

  public detectHidden: boolean;
  public detectDisguised: boolean;

  constructor(private readonly withSubscriptionHelper: WithSubscriptionHelper) {
    this.actionSelected = new EventEmitter<ActionableEvent>();
    this.actions = ArrayView.empty();

    this.aggressiveTooltip = GameStringsStore.tooltips['aggressive'];
    this.retaliateTooltip = GameStringsStore.tooltips['retaliate'];
    this.playerTooltip = GameStringsStore.tooltips['retaliate'];
    this.searchTooltip = GameStringsStore.tooltips['search'];
    this.visibilityTooltip = GameStringsStore.tooltips['visibility'];

    this.detectHidden = false;
    this.detectDisguised = false;

    this.basePath = '../../../assets/icons';
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.interactive.actionsChanged$.subscribe((actions) => {
        this.actions = actions;
      })
    );

    if (
      this.interactive.classification !== 'REACTIVE' &&
      this.interactive.ignores?.items.length
    ) {
      this.detectHidden = !this.interactive.ignores.items.includes('HIDDEN');
      this.detectDisguised =
        !this.interactive.ignores.items.includes('DISGUISED');
    }
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(new ActionableEvent(action, this.interactive.id));
  }

  public setIcon(actionable: ActionableLiteral) {
    switch (actionable) {
      case 'SCENE':
        return {
          icon: `${this.basePath}/scene.svg`,
          tooltip: 'Transit to next scene',
        };
      case 'SKILL':
        return {
          icon: `${this.basePath}/skill.svg`,
          tooltip: `Skill check`,
        };
      case 'PICK':
        return {
          icon: `${this.basePath}/pick.svg`,
          tooltip: `Pick up item`,
        };
      case 'AFFECT':
        return {
          icon: `${this.basePath}/affect.svg`,
          tooltip: `Use equipped weapon on target`,
        };
      case 'USE':
        return {
          icon: `${this.basePath}/use.svg`,
          tooltip: `Use item from inventory`,
        };
      case 'INTERACTION':
        return {
          icon: `${this.basePath}/interaction.svg`,
          tooltip: `Interact with the target`,
        };
      default:
        return {
          icon: `${this.basePath}/none.svg`,
          tooltip: 'Action not recognized',
        };
    }
  }
}
