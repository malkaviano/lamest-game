import { InteractiveEntity } from '../entities/interactive.entity';

export class Scene {
  constructor(
    public readonly id: string,
    public readonly paragraphs: string[],
    public readonly interactives: InteractiveEntity[]
  ) {}
}
