import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActionMetaService {
  getTooltip(actionable: string): string {
    switch (actionable) {
      case 'SCENE':
        return 'Transit to next scene';
      case 'SKILL':
        return 'Skill check';
      case 'PICK':
        return 'Pick up item';
      case 'AFFECT':
        return 'Use equipped weapon on target';
      case 'ACCESSORY':
        return 'Use item from inventory';
      case 'USE':
        return 'Use accessory on target';
      case 'INTERACTION':
        return 'Interact with the target';
      // TODO AI: Write proper tooltips for empty strings
      case 'EQUIP':
        return '';
      case 'UNEQUIP':
        return '';
      case 'READ':
        return '';
      case 'DROP':
        return '';
      case 'WEAR':
        return '';
      case 'STRIP':
        return '';
      default:
        return 'Action not recognized';
    }
  }

  getEmoji(actionable: string): string {
    switch (actionable) {
      case 'SCENE':
        return '🗺️';
      case 'SKILL':
        return '🎯';
      case 'PICK':
        return '📦';
      case 'AFFECT':
        return '⚔️';
      case 'ACCESSORY':
        return '🛠️';
      case 'USE':
        return '🧰';
      case 'INTERACTION':
        return '💬';
      case 'EQUIP':
        return '🗡️';
      case 'UNEQUIP':
        return '📥';
      case 'READ':
        return '📖';
      case 'DROP':
        return '🗑️';
      case 'WEAR':
        return '🛡️';
      case 'STRIP':
        return '🧥';
      default:
        return '❔';
    }
  }
}
