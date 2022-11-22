import { GameItemDefinition } from './game-item.definition';

export class ConsumableDefinition extends GameItemDefinition {
  constructor(name: string, label: string, description: string) {
    super('CONSUMABLE', name, label, description);
  }
}
