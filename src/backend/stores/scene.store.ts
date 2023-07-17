import { ConverterHelper } from '@helpers/converter.helper';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ActorStore } from '@stores/actor.store';
import { InteractiveStore } from '@stores/interactive.store';
import { ResourcesStore } from '@stores/resources.store';
import { ArrayView } from '@wrappers/array.view';
import { SceneEntity } from '@entities/scene.entity';
import { InteractiveEntity } from '@entities/interactive.entity';
import { SimpleState } from '@states/simple.state';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { GameStringsStore } from '@stores/game-strings.store';

export class SceneStore {
  private readonly store: Map<string, SceneEntity>;

  public readonly initial: string;

  public readonly transitions: KeyValueInterface<KeyValueInterface<string>>;

  constructor(
    interactiveStore: InteractiveStore,
    actorStore: ActorStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, SceneEntity>();

    this.transitions = resourcesStore.sceneStore.transitions.reduce(
      (
        obj: { [key: string]: { [key: string]: string } },
        { name, sceneA, sceneB }
      ) => {
        obj[name] = { [sceneA]: sceneB, [sceneB]: sceneA };

        return obj;
      },
      {}
    );

    resourcesStore.sceneStore.scenes.forEach((scene) => {
      const interactives = scene.interactives.map((id) => {
        return interactiveStore.interactives[id] ?? actorStore.actors[id];
      });

      const sceneExits = resourcesStore.sceneStore.transitions
        .filter((obj) => obj.sceneA === scene.name || obj.sceneB === scene.name)
        .map((obj) => {
          const destinationName =
            obj.sceneA === scene.name ? obj.sceneB : obj.sceneA;

          const destination = resourcesStore.sceneStore.scenes.find(
            (s) => s.name === destinationName
          );

          return new InteractiveEntity(
            obj.name,
            obj.label,
            `${scene.label} <-> ${destination?.label}`,
            new SimpleState(
              ArrayView.create(
                createActionableDefinition(
                  'SCENE',
                  obj.name,
                  GameStringsStore.descriptions['TRANSIT']
                )
              )
            ),
            true
          );
        });

      const allInteractives = interactives.concat(sceneExits);

      // Sort interactives
      this.orderInteractives(allInteractives);

      this.store.set(
        scene.name,
        new SceneEntity(
          scene.name,
          scene.label,
          ArrayView.fromArray(allInteractives),
          scene.image
        )
      );
    });

    this.initial = resourcesStore.sceneStore.initial;
  }

  public get scenes(): KeyValueInterface<SceneEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }

  private orderInteractives(
    interactives: InteractiveEntity[]
  ): InteractiveEntity[] {
    return interactives.sort((i1, i2) => {
      return this.classifyInteractive(i1) - this.classifyInteractive(i2);
    });
  }

  private classifyInteractive(interactive: InteractiveEntity): number {
    let value = 0;

    switch (interactive.classification) {
      case 'ACTOR':
        value += 2;
        break;
      case 'PLAYER':
        value += 1;
        break;
      default:
        value += 3;
        break;
    }

    switch (interactive.behavior) {
      case 'PLAYER':
        value += 1;
        break;
      case 'AGGRESSIVE':
        value += 2;
        break;
      case 'RETALIATE':
        value += 3;
        break;
      default:
        value += 4;
        break;
    }

    return value;
  }
}
