import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { CharacteristicNameLiteral } from '@literals/characteristic-name.literal';

export type CharacteristicSetDefinition = {
  readonly [key in CharacteristicNameLiteral]: CharacteristicDefinition;
};
