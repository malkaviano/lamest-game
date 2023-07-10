import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActorInterface } from '@interfaces/actor.interface';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ActorEntity } from '../entities/actor.entity';

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
