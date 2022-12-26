import { CharacteristicSetDefinition } from '../../definitions/characteristic-set.definition';
import { AiBehaviorLiteral } from '../../literals/enemy-behavior.literal';
import { ActorSettingsInterface } from '../actor-settings.interface';

export interface ActorStoreInterface {
  readonly actors: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly resettable: boolean;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<string, number>;
    readonly equippedWeapon: string;
    readonly killedState: string;
    readonly behaviorState: string;
    readonly actorSettings: ActorSettingsInterface;
    readonly aiBehavior: AiBehaviorLiteral;
  }[];
}
