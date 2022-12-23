import { Injectable } from '@angular/core';
import { ActorEntity } from '../entities/actor.entity';

import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { ActorInterface } from '../interfaces/actor.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';

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

  public asActor(target: ActionReactiveInterface): ActorInterface | null {
    return target instanceof ActorEntity &&
      ['ACTOR', 'PLAYER'].includes(target.classification)
      ? target
      : null;
  }
}
