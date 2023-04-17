import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';

export interface WithCharacteristicsInterface {
  get characteristics(): CharacteristicSetDefinition;
}
