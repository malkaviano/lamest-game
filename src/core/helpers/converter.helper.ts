import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';
import { ActorEntity } from '../../core/entities/actor.entity';

export class ConverterHelper {
  public static mapToKeyValueInterface<Value>(
    obj: Map<string, Value>
  ): KeyValueInterface<Value> {
    return Array.from(obj.entries()).reduce(
      (acc: { [key: string]: Value }, [k, v]) => {
        acc[k] = v;

        return acc;
      },
      {}
    );
  }

  public static asActor(target: InteractiveInterface): ActorInterface | null {
    return target instanceof ActorEntity &&
      ['ACTOR', 'PLAYER'].includes(target.classification)
      ? target
      : null;
  }
}
