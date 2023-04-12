import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActorEntity } from '../entities/actor.entity';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { GameStringsStore } from '../stores/game-strings.store';
import { ArrayView } from '../model-views/array.view';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class VisibilityState extends ActionableState {
  constructor(
    stateAction: ActionableDefinition,
    private readonly maximumTries: number
  ) {
    super('VisibilityState', ArrayView.create([stateAction]));
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string } {
    const actor = values.actor;

    const target = values.target;

    if (!actor && ['Disguise', 'Hide'].includes(action.name)) {
      throw new Error(GameStringsStore.errorMessages['INVALID-OPERATION']);
    }

    if (!(target instanceof ActorEntity) && ['Detect'].includes(action.name)) {
      throw new Error(GameStringsStore.errorMessages['INVALID-OPERATION']);
    }

    const actorVisibility = this.actorVisibility(action.name);

    switch (result) {
      case 'SUCCESS':
        if (actor && actorVisibility) {
          actor.changeVisibility(actorVisibility);
        }

        if (target instanceof ActorEntity && action.name === 'Detect') {
          target.changeVisibility('VISIBLE');
        }

        return { state: emptyState };
      case 'FAILURE':
        return {
          state:
            this.maximumTries - 1 > 0
              ? new VisibilityState(
                  this.stateActions.items[0],
                  this.maximumTries - 1
                )
              : emptyState,
        };
      default:
        return { state: this };
    }
  }

  private actorVisibility(skillName: string): VisibilityLiteral | null {
    if (skillName === 'Disguise') {
      return 'DISGUISED';
    }

    if (skillName === 'Hide') {
      return 'HIDDEN';
    }

    return null;
  }
}
