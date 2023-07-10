import { CharacterIdentityDefinition } from '@definitions/character-identity.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from './actor.interface';

export interface PlayerInterface extends ActorInterface {
  get identity(): CharacterIdentityDefinition;

  playerDecision(event: ActionableEvent | null): void;
}
