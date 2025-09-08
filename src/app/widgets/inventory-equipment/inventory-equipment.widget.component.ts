import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  ActionableDefinition,
  dropActionable,
} from '@definitions/actionable.definition';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ActionableEvent } from '@events/actionable.event';

@Component({
  selector: 'app-inventory-equipment-widget',
  templateUrl: './inventory-equipment.widget.component.html',
  styleUrls: ['./inventory-equipment.widget.component.css'],
})
export class EquipmentWidgetComponent {
  @Input() equipment!: ActionableItemDefinition;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  private readonly basePath: string;

  readonly actionClass: { [key: string]: string };

  public dropAction = dropActionable;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.basePath = '../../../assets/icons';

    this.actionClass = {
      WEAR: 'wear-action',
      EQUIP: 'equip-action',
      READ: 'read-action',
      CONSUME: 'consume-action',
      USE: 'use-action',
      ACCESSORY: 'use-action',
      DROP: 'drop-action',
    };
  }

  metaFor(actionable: string): {
    icon: string;
    tooltip: string;
    css: string;
  } {
    switch (actionable) {
      case 'WEAR':
        return {
          icon: `${this.basePath}/wear.svg`,
          tooltip: 'Wear',
          css: this.actionClass['WEAR'],
        };
      case 'EQUIP':
        return {
          icon: `${this.basePath}/equip.svg`,
          tooltip: 'Equip',
          css: this.actionClass['EQUIP'],
        };
      case 'READ':
        return {
          icon: `${this.basePath}/read.svg`,
          tooltip: 'Read',
          css: this.actionClass['READ'],
        };
      case 'CONSUME':
        return {
          icon: `${this.basePath}/consume.svg`,
          tooltip: 'Consume',
          css: this.actionClass['CONSUME'],
        };
      case 'USE':
        return {
          icon: `${this.basePath}/use.svg`,
          tooltip: 'Use',
          css: this.actionClass['USE'],
        };
      case 'ACCESSORY':
        return {
          icon: `${this.basePath}/use.svg`,
          tooltip: 'Use',
          css: this.actionClass['ACCESSORY'],
        };
      case 'DROP':
      default:
        return {
          icon: `${this.basePath}/drop.svg`,
          tooltip: 'Drop',
          css: this.actionClass['DROP'],
        };
    }
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(
      new ActionableEvent(action, this.equipment.item.identity.name)
    );
  }
}
