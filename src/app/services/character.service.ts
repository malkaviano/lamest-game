import { Injectable } from '@angular/core';

import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { CharacterEntity } from '../entities/character.entity';
import { RandomCharacterService } from './random-character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly character: CharacterEntity;

  private readonly characterChanged: BehaviorSubject<CharacterEntity>;

  public readonly characterChanged$: Observable<CharacterEntity>;

  constructor(private readonly randomCharacterService: RandomCharacterService) {
    this.character = this.randomCharacter;

    this.characterChanged = new BehaviorSubject(this.currentCharacter);

    this.characterChanged$ = merge(
      this.characterChanged.asObservable(),
      this.currentCharacter.hpChanged$.pipe(map((_) => this.currentCharacter))
    );
  }

  public get currentCharacter(): CharacterEntity {
    return this.character;
  }

  public get randomCharacter(): CharacterEntity {
    return this.randomCharacterService.character();
  }
}
