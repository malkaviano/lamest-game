import { Injectable } from '@angular/core';
import { CharacterEntity } from '../entities/character.entity';
import { RandomCharacterService } from './random-character.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterManagerService {
  private character: CharacterEntity | null;

  constructor(private readonly randomCharacterService: RandomCharacterService) {
    this.character = null;
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
