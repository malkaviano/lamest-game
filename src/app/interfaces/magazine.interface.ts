import { WeaponCaliberLiteral } from '../literals/weapon-caliber.literal';

export interface MagazineInterface {
  readonly name: string;
  readonly quantity: number;
  readonly caliber: WeaponCaliberLiteral;
}
