import { ConverterHelper } from '../core/helpers/converter.helper';
import { KeyValueInterface } from '../core/interfaces/key-value.interface';
import { ActorStore } from './actor.store';
import { InteractiveStore } from './interactive.store';
import { ResourcesStore } from './resources.store';
import { ArrayView } from '../core/view-models/array.view';
import { SceneEntity } from '../core/entities/scene.entity';
import { InteractiveEntity } from '../core/entities/interactive.entity';

export class SceneStore {
  private readonly store: Map<string, SceneEntity>;

  public readonly initial: string;

  constructor(
    interactiveStore: InteractiveStore,
    actorStore: ActorStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, SceneEntity>();

    resourcesStore.sceneStore.scenes.forEach((scene) => {
      const interactives = scene.interactives.map((id) => {
        return interactiveStore.interactives[id] ?? actorStore.actors[id];
      });

      // Sort interactives
      this.orderInteractives(interactives);

      const transitions = scene.transitions.reduce(
        (obj: { [key: string]: string }, { name, scene }) => {
          obj[name] = scene;

          return obj;
        },
        {}
      );

      this.store.set(
        scene.name,
        new SceneEntity(
          scene.description,
          ArrayView.create(interactives),
          transitions,
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
