import { Component, Input, OnChanges } from '@angular/core';

import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';

@Component({
  selector: 'app-window-widget',
  templateUrl: './window.widget.component.html',
  styleUrls: ['./window.widget.component.css'],
})
export class WindowWidgetComponent implements OnChanges {
  @Input() public keyValue!: KeyValueDescriptionView;
  
  // Computed properties - calculated once when input changes
  public isNumeric: boolean = false;
  public isStat: boolean = false;
  public tooltipText: string = '';

  public ngOnChanges(): void {
    this.updateComputedProperties();
  }

  private updateComputedProperties(): void {
    // Compute isNumeric once
    this.isNumeric = !isNaN(Number(this.keyValue.value)) && !isNaN(parseFloat(this.keyValue.value));
    
    // Compute isStat once  
    this.isStat = this.keyValue.category === 'characteristic' || this.keyValue.category === 'derived-attribute';
    
    // Compute tooltipText once
    this.tooltipText = this.computeTooltipText();
  }

  private computeTooltipText(): string {
    // Always prefer the original description if available
    if (this.keyValue.description && this.keyValue.description.trim().length > 0) {
      return this.keyValue.description;
    }
    
    // Fallback tooltips based on category
    switch (this.keyValue.category) {
      case 'identity':
        return `Character Identity: ${this.keyValue.key} = ${this.keyValue.value}`;
      
      case 'characteristic':
        return `Characteristic: ${this.keyValue.key} with value ${this.keyValue.value}`;
      
      case 'derived-attribute':
        return `Derived Attribute: ${this.keyValue.key} = ${this.keyValue.value}`;
      
      case 'skill':
        return `Skill: ${this.keyValue.key} at level ${this.keyValue.value}`;
      
      case 'unknown':
      default:
        return `${this.keyValue.key}: ${this.keyValue.value}`;
    }
  }
}
