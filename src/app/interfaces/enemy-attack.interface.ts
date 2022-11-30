import { DamageDefinition } from '../definitions/damage.definition';

export interface EnemyAttack {
  readonly skillValue: number;
  readonly damage: DamageDefinition;
  readonly dodgeable: boolean;
  readonly weaponName: string;
}
