import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { ClassificationLiteral } from '@literals/classification.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';

export interface SceneActorsInfoInterface {
  readonly id: string;
  readonly classification: ClassificationLiteral;
  readonly situation: ActorSituationLiteral;
  readonly visibility: VisibilityLiteral;
}
