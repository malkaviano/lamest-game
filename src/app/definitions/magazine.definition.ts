import { WeaponCaliberLiteral } from '../literals/weapon-caliber.literal';

export class MagazineDefinition {
  constructor(
    public readonly caliber: WeaponCaliberLiteral,
    public readonly quantity: number
  ) {}
}
