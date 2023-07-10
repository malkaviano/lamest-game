import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { RandomCharacterService } from './random-character.service';
import { PlayerInterface } from '@core/interfaces/player.interface';

export class CharacterService {
  private readonly character: PlayerInterface;

  private readonly characterChanged: BehaviorSubject<PlayerInterface>;

  public readonly characterChanged$: Observable<PlayerInterface>;

  constructor(private readonly randomCharacterService: RandomCharacterService) {
    this.character = this.randomCharacter;

    this.characterChanged = new BehaviorSubject(this.currentCharacter);

    this.characterChanged$ = merge(
      this.characterChanged.asObservable(),
      this.currentCharacter.hpChanged$.pipe(map(() => this.currentCharacter)),
      this.currentCharacter.epChanged$.pipe(map(() => this.currentCharacter)),
      this.currentCharacter.visibilityChanged$.pipe(
        map(() => this.currentCharacter)
      ),
      this.currentCharacter.weaponEquippedChanged$.pipe(
        map(() => this.currentCharacter)
      ),
      this.currentCharacter.apChanged$.pipe(map(() => this.currentCharacter))
    );
  }

  public get currentCharacter(): PlayerInterface {
    return this.character;
  }

  public get randomCharacter(): PlayerInterface {
    return this.randomCharacterService.character();
  }
}
