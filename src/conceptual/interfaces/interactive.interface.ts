import { Observable } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ClassificationLiteral } from '@literals/classification.literal';
import { ReactionValuesInterface } from './reaction-values.interface';
import { ArrayView } from '../view-models/array.view';
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

  reactTo(
    selected: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValuesInterface
  ): string | null;

  reset(): void;
}
