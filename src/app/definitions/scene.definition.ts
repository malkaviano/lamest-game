import { Interactive } from './interactive.definition';
import { SelectedAction } from './selected-action.definition';

export class Scene {
  constructor(
    public readonly text: string,
    public readonly interactives: Interactive[]
  ) {}

  registerEvent(event: SelectedAction) {
    console.log(event);
  }
}
