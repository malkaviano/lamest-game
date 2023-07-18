import { CharacteristicValues } from '@values/characteristic.value';

export interface WithCharacteristicsInterface {
  get characteristics(): CharacteristicValues;
}
