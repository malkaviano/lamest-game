import { Injectable } from '@angular/core';

import { GameSettingsInterface } from '../core/interfaces/game-settings.interface';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class SettingsStore {
  private readonly mSettings: GameSettingsInterface;

  constructor(resourcesStore: ResourcesStore) {
    this.mSettings = resourcesStore.settingsStore.settings;
  }

  public get settings(): GameSettingsInterface {
    return Object.assign({}, this.mSettings);
  }
}
