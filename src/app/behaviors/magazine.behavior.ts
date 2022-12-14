import { errorMessages } from '../definitions/error-messages.definition';
import { MagazineDefinition } from '../definitions/magazine.definition';
import { MagazineInterface } from '../interfaces/magazine.interface';
import { ReloadMechanismLiteral } from '../literals/reload-mechanism.literal';
import { WeaponCaliberLiteral } from '../literals/weapon-caliber.literal';

export class MagazineBehavior {
  private ammoInMagazine: number;

  public readonly name: ReloadMechanismLiteral;

  constructor(public readonly caliber: WeaponCaliberLiteral) {
    this.name = 'MAGAZINE';

    this.ammoInMagazine = 0;
  }

  public info(): MagazineInterface {
    return {
      name: this.name,
      quantity: this.ammoInMagazine,
      caliber: this.caliber,
    };
  }

  public reload(magazine: MagazineDefinition): MagazineDefinition | null {
    if (magazine.caliber !== this.caliber) {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    const old = this.ammoInMagazine;

    this.ammoInMagazine = magazine.quantity;

    return old ? new MagazineDefinition(this.caliber, old) : null;
  }

  public drop(): number {
    if (this.ammoInMagazine > 0) {
      this.ammoInMagazine--;

      return 1;
    }

    return 0;
  }
}
