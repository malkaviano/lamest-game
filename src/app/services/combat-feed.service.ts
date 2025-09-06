import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CombatEvent } from '@interfaces/combat-event.interface';
import { LogCategoryLiteral } from '@literals/log-category.literal';
import { FloatingNumbersService } from './floating-numbers.service';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class CombatFeedService {
  private readonly subject = new Subject<CombatEvent>();
  public readonly combatEvents$ = this.subject.asObservable();

  constructor(
    private readonly floating: FloatingNumbersService,
    private readonly sound: SoundService
  ) {}

  emit(event: CombatEvent): void {
    this.subject.next(event);
  }

  // Convenience: drive visuals/sounds for a single event.
  handle(event: CombatEvent, anchor?: { x: number; y: number }): void {
    const x = anchor?.x ?? window.innerWidth / 2;
    const y = anchor?.y ?? window.innerHeight / 2;

    switch (event.outcome) {
      case 'HIT':
      case 'CRIT': {
        if (event.amount && event.amount > 0) {
          const offset = event.outcome === 'CRIT' ? 50 : 30;
          this.floating.showDamage(event.amount, x, y - offset, event.effectType);
        }
        this.sound.playSound('AFFECTED' as LogCategoryLiteral);
        break;
      }
      case 'HEAL': {
        if (event.amount && event.amount > 0) {
          this.floating.showHealing(event.amount, x, y + 10);
        }
        this.sound.playSound('AFFECTED' as LogCategoryLiteral);
        break;
      }
      case 'DODGE': {
        this.floating.showText('Dodge', x, y - 10);
        this.sound.playSound('MISSED' as LogCategoryLiteral);
        break;
      }
      case 'MISS': {
        this.floating.showText('Miss', x, y - 10);
        this.sound.playSound('MISSED' as LogCategoryLiteral);
        break;
      }
    }
  }
}
