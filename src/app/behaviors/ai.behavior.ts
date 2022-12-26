import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';
import { AiBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { ArrayView } from '../views/array.view';

export class AiBehavior {
  constructor(public readonly aiBehavior: AiBehaviorLiteral) {}

  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>,
    afflictedBy: string[]
  ): ActionableEvent | null {
    const player = sceneActorsInfo.items.find(
      (a) =>
        a.classification === 'PLAYER' &&
        a.situation === 'ALIVE' &&
        a.visibility === 'VISIBLE'
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

  public static create(aiBehavior: AiBehaviorLiteral): AiBehavior {
    return new AiBehavior(aiBehavior);
  }
}
