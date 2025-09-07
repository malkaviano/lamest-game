import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActorInterface } from '../interfaces/actor.interface';

export class SceneEntity {
  constructor(
    public readonly name: string,
    public readonly label: string,
    private readonly mInteractives: ArrayView<InteractiveInterface>,
    public readonly image: string
  ) {}

  public get interactives(): ArrayView<InteractiveInterface> {
    return this.mInteractives.filter((i) => i.actions.items.length > 0);
  }

  public get visibleInteractives(): ArrayView<InteractiveInterface> {
    return this.interactives.filter((i) => i.visibility === 'VISIBLE');
  }

  public get visibleActors(): ArrayView<ActorInterface> {
    return this.visibleInteractives.filter(
      (interactive) => interactive.classification === 'ACTOR'
    ) as ArrayView<ActorInterface>;
  }

  public get visibleReactives(): ArrayView<InteractiveInterface> {
    return this.visibleInteractives.filter(
      (interactive) =>
        interactive.classification === 'REACTIVE' &&
        !interactive.actions.items.some(
          (action) => action.actionable === 'SCENE'
        )
    );
  }

  public reset(): void {
    this.mInteractives.items.forEach((i) => i.reset());
  }
}
