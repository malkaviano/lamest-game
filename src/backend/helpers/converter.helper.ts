import { Injectable } from '@angular/core';

import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';
import { ActorEntity } from '../../core/entities/actor.entity';

@Injectable({
  providedIn: 'root',
})
export class ConverterHelper {
  public mapToKeyValueInterface<Value>(
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

  public asActor(target: InteractiveInterface): ActorInterface | null {
    return target instanceof ActorEntity &&
      ['ACTOR', 'PLAYER'].includes(target.classification)
      ? target
      : null;
  }
}
