import { Interactive } from './interactive.definition';

export class Scene {
  constructor(
    public readonly id: string,
    public readonly paragraphs: string[],
    public readonly interactives: Interactive[]
  ) {}
}
