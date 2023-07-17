import { ArmorDefinition } from '@definitions/armor.definition';

export interface ArmorWearingInterface {
  get armorWearing(): ArmorDefinition;

  wear(weapon: ArmorDefinition): ArmorDefinition | null;

  strip(): ArmorDefinition | null;
}
