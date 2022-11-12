import { Injectable } from '@angular/core';

import { ArrayView } from '../definitions/array-view.definition';
import { KeyValueDescription } from '../definitions/key-value-description.definition';
import { GeneratorService } from './generator.service';
import { Characteristics } from '../definitions/characteristics.definition';
import { DerivedAttributes } from '../definitions/attributes.definition';
import { DerivedAttribute } from '../definitions/attribute.definition';
import { CharacterIdentity } from '../definitions/character-identity.definition';
import { IdentityFeature } from '../definitions/identity-feature.definition';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private readonly generator: GeneratorService) {}

  public identity(): CharacterIdentity {
    return this.generator.identity();
  }

  public characteristics(): Characteristics {
    return this.generator.characteristics();
  }

  public attributes(characteristics: Characteristics): DerivedAttributes {
    const hp = Math.trunc(
      (characteristics.con.value + characteristics.siz.value) / 2
    );

    const pp = characteristics.pow.value;

    return new DerivedAttributes(
      new DerivedAttribute('HP', hp, 'The character hit points'),
      new DerivedAttribute('PP', pp, 'The character power points'),
      new DerivedAttribute('MOV', 10, 'The character movement')
    );
  }
}
