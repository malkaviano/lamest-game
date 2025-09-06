import { Component, Input } from '@angular/core';

import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';

@Component({
  selector: 'app-window-widget',
  templateUrl: './window.widget.component.html',
  styleUrls: ['./window.widget.component.css'],
})
export class WindowWidgetComponent {
  @Input() public keyValue!: KeyValueDescriptionView;

  /**
   * Check if a value is numeric (keeping for backward compatibility)
   */
  public isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  /**
   * Check if a key represents a stat value based on category
   */
  public isStatValue(keyValue: KeyValueDescriptionView): boolean {
    return keyValue.category === 'characteristic' || keyValue.category === 'derived-attribute';
  }

  /**
   * Get tooltip text with fallback based on category
   */
  public getTooltipText(keyValue: KeyValueDescriptionView): string {
    // Always prefer the original description if available
    if (keyValue.description && keyValue.description.trim().length > 0) {
      return keyValue.description;
    }
    
    // Fallback tooltips based on category (no fragile heuristics!)
    switch (keyValue.category) {
      case 'identity':
        return `Character Identity: ${keyValue.key} = ${keyValue.value}`;
      
      case 'characteristic':
        return `Characteristic: ${keyValue.key} with value ${keyValue.value}`;
      
      case 'derived-attribute':
        return `Derived Attribute: ${keyValue.key} = ${keyValue.value}`;
      
      case 'skill':
        return `Skill: ${keyValue.key} at level ${keyValue.value}`;
      
      case 'unknown':
      default:
        return `${keyValue.key}: ${keyValue.value}`;
    }
  }
}
