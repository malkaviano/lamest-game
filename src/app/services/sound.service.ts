import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { LogCategoryLiteral } from '@literals/log-category.literal';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private sounds: Map<string, Howl> = new Map();
  private isEnabled = true;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds(): void {
    const soundFiles = {
      equipped: 'assets/sounds/equip.mp3',
      unequipped: 'assets/sounds/unequip.mp3',
      took: 'assets/sounds/pickup.mp3',
      consumed: 'assets/sounds/consume.mp3',
      died: 'assets/sounds/death.mp3',
      missed: 'assets/sounds/miss.mp3',
      affected: 'assets/sounds/hit.mp3',
      opened: 'assets/sounds/door.mp3',
      read: 'assets/sounds/page.mp3',
      scene: 'assets/sounds/step.mp3',
      success: 'assets/sounds/success.mp3',
      error: 'assets/sounds/error.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      this.sounds.set(key, new Howl({
        src: [path],
        volume: 0.3,
        preload: false
      }));
    });
  }

  public playSound(category: LogCategoryLiteral): void {
    if (!this.isEnabled) return;

    const soundMap: { [key in LogCategoryLiteral]?: string } = {
      'EQUIPPED': 'equipped',
      'UNEQUIPPED': 'unequipped', 
      'TOOK': 'took',
      'CONSUMED': 'consumed',
      'DIED': 'died',
      'MISSED': 'missed',
      'AFFECTED': 'affected',
      'OPENED': 'opened',
      'READ': 'read',
      'SCENE': 'scene',
      'CHECK': 'success',
      'USED': 'success',
      'INTERACTED': 'success',
      'EQUIP-ERROR': 'error',
      'NOT-FOUND': 'error',
      'DENIED': 'error',
      'LOST': 'error',
      'VISIBILITY': 'success',
      'AP': 'success',
      'WEARING': 'equipped',
      'STRIP': 'unequipped',
      'COOLDOWN': 'error',
      'ACTIVATION': 'success'
    };

    const soundKey = soundMap[category];
    if (soundKey && this.sounds.has(soundKey)) {
      this.sounds.get(soundKey)?.play();
    }
  }

  public toggleSound(): void {
    this.isEnabled = !this.isEnabled;
  }

  public setVolume(volume: number): void {
    this.sounds.forEach(sound => {
      sound.volume(Math.max(0, Math.min(1, volume)));
    });
  }
}