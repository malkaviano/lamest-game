import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { CharacteristicNameLiteral } from '@literals/characteristic-name.literal';

export type CharacteristicValues = {
  readonly [key in CharacteristicNameLiteral]: CharacteristicDefinition;
};
