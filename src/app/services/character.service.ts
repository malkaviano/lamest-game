import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { CharacterEntity } from '../entities/character.entity';
import { RandomCharacterService } from './random-character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private character: CharacterEntity | null;

  private readonly characterChanged: BehaviorSubject<CharacterEntity>;

  public readonly characterChanged$: Observable<CharacterEntity>;

  constructor(private readonly randomCharacterService: RandomCharacterService) {
    this.character = null;

    this.characterChanged = new BehaviorSubject(this.currentCharacter);

    this.characterChanged$ = this.characterChanged.asObservable();
  }

  public get currentCharacter(): CharacterEntity {
    if (!this.character) {
      this.character = this.randomCharacter;
    }

    return this.character;
  }

  public get randomCharacter(): CharacterEntity {
    return this.randomCharacterService.character();
  }
}
