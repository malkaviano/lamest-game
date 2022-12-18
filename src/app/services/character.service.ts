import { Injectable } from '@angular/core';

import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { PlayerEntity } from '../entities/player.entity';
import { RandomCharacterService } from './random-character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly character: PlayerEntity;

  private readonly characterChanged: BehaviorSubject<PlayerEntity>;

  public readonly characterChanged$: Observable<PlayerEntity>;

  constructor(private readonly randomCharacterService: RandomCharacterService) {
    this.character = this.randomCharacter;

    this.characterChanged = new BehaviorSubject(this.currentCharacter);

    this.characterChanged$ = merge(
      this.characterChanged.asObservable(),
      this.currentCharacter.hpChanged$.pipe(map(() => this.currentCharacter)),
      this.currentCharacter.epChanged$.pipe(map(() => this.currentCharacter)),
      this.currentCharacter.weaponEquippedChanged$.pipe(
        map(() => this.currentCharacter)
      )
    );
  }

  public get currentCharacter(): PlayerEntity {
    return this.character;
  }

  public get randomCharacter(): PlayerEntity {
    return this.randomCharacterService.character();
  }
}
