import { createActionableDefinition } from '@definitions/actionable.definition';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { SceneActorsInfoInterface } from '@interfaces/scene-actors.interface';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { ArrayView } from '@wrappers/array.view';

export class AiBehavior {
  constructor(
    public readonly aiBehavior: BehaviorLiteral,
    public readonly ignores: ArrayView<VisibilityLiteral>
  ) {}

  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>,
    afflictedBy: string[]
  ): ActionableEvent | null {
    const player = sceneActorsInfo.items.find(
      (a) =>
        a.classification === 'PLAYER' &&
        a.situation === 'ALIVE' &&
        !this.ignores.items.includes(a.visibility)
    );

    if (player) {
      const reactEvent = new ActionableEvent(
        createActionableDefinition('AFFECT', 'affect', 'Use Equipped'),
        player.id
      );

      if (
        (this.aiBehavior === 'RETALIATE' && afflictedBy.includes(player.id)) ||
        this.aiBehavior === 'AGGRESSIVE'
      ) {
        return reactEvent;
      }
    }

    return null;
  }

  public static create(
    aiBehavior: BehaviorLiteral,
    ignores: ArrayView<VisibilityLiteral>
  ): AiBehavior {
    return new AiBehavior(aiBehavior, ignores);
  }
}
