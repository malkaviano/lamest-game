import { Observable } from 'rxjs';

export interface ActorCooldownInterface {
  readonly canActChanged$: Observable<boolean>;
}
