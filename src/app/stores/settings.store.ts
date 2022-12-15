import { Injectable } from '@angular/core';

import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ArrayView } from '../views/array.view';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  public readonly settings: {
    readonly professionPoints: number;
    readonly intelligencePoints: number;
    readonly playerEffectDefenses: {
      readonly immunities: ArrayView<EffectTypeLiteral>;
      readonly cures: ArrayView<EffectTypeLiteral>;
      readonly vulnerabilities: ArrayView<EffectTypeLiteral>;
      readonly resistances: ArrayView<EffectTypeLiteral>;
    };
  };

  constructor(resourcesStore: ResourcesStore) {
    this.settings = resourcesStore.settingsStore.settings;
  }
}
