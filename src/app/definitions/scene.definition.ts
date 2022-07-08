import { Interactive } from './interactive.definition';

export class Scene {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly interactives: Interactive[]
  ) {}
}
