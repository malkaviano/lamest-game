import { Injectable } from '@angular/core';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

@Injectable({ providedIn: 'root' })
export class HighlightService {
  flashInteractiveCard(interactiveId: string, effectType?: EffectTypeLiteral): void {
    const el = document.querySelector(
      `[data-testid="interactive-${interactiveId}"]`
    ) as HTMLElement | null;
    if (!el) return;

    const className = this.classForEffect(effectType);
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), 250);
  }

  private classForEffect(effectType?: EffectTypeLiteral): string {
    switch (effectType) {
      case 'FIRE':
        return 'highlight-hit-fire';
      case 'ACID':
        return 'highlight-hit-acid';
      case 'PROFANE':
        return 'highlight-hit-profane';
      case 'SACRED':
        return 'highlight-hit-sacred';
      case 'KINETIC':
      default:
        return 'highlight-hit';
    }
  }
}

