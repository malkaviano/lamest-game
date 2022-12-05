import { WeaponDefinition } from '../definitions/weapon.definition';

export interface EnemyAttack {
  readonly skillValue: number;
  readonly weapon: WeaponDefinition;
}
