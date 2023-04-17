import { createActionableDefinition } from '../../core/definitions/actionable.definition';
import { ActionableEvent } from '../../core/events/actionable.event';
import { SceneActorsInfoInterface } from '../../core/interfaces/scene-actors.interface';
import { AiBehaviorLiteral } from '../../core/literals/enemy-behavior.literal';
import { VisibilityLiteral } from '../../core/literals/visibility.literal';
import { ArrayView } from '../../core/view-models/array.view';

export class AiBehavior {
  constructor(
    public readonly aiBehavior: AiBehaviorLiteral,
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
    aiBehavior: AiBehaviorLiteral,
    ignores: ArrayView<VisibilityLiteral>
  ): AiBehavior {
    return new AiBehavior(aiBehavior, ignores);
  }
}
