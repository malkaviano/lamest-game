import { GameItemDefinition } from './game-item.definition';

export class UsableItemDefinition extends GameItemDefinition {
  constructor(name: string, label: string, description: string) {
    super('USABLE', name, label, description);
  }
}
