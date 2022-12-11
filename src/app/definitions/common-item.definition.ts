import { GameItemDefinition } from './game-item.definition';

export class CommonItemDefinition extends GameItemDefinition {
  constructor(name: string, label: string, description: string) {
    super('COMMON', name, label, description);
  }
}
