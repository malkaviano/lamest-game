import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';

export interface SceneActorsInfoInterface {
  readonly id: string;
  readonly classification: ClassificationLiteral;
  readonly situation: ActorSituationLiteral;
}
