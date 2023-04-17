import { GameSettingsInterface } from '../core/interfaces/game-settings.interface';
import { ResourcesStore } from './resources.store';

export class SettingsStore {
  private readonly mSettings: GameSettingsInterface;

  constructor(resourcesStore: ResourcesStore) {
    this.mSettings = resourcesStore.settingsStore.settings;
  }

  public get settings(): GameSettingsInterface {
    return Object.assign({}, this.mSettings);
  }
}
