import { GameItemDefinition } from './game-item.definition';

export class WeaponDefinition extends GameItemDefinition {
  constructor(name: string, label: string, description: string) {
    super('WEAPON', name, label, description);
  }
}
