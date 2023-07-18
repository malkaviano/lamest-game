import { Observable } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ClassificationLiteral } from '@literals/classification.literal';
import { ReactionValues } from '@values/reaction.values';
import { ArrayView } from '@wrappers/array.view';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

export interface InteractiveInterface {
  get id(): string;

  get name(): string;

  get description(): string;

  get classification(): ClassificationLiteral;

  get behavior(): BehaviorLiteral;

  get ignores(): ArrayView<VisibilityLiteral>;

  readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  // TODO: improve return type
  reactTo(
    selected: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValues
  ): string | null;

  reset(): void;
}
