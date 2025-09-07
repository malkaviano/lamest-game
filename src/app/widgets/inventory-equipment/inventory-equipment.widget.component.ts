import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ActionableEvent } from '@events/actionable.event';

@Component({
  selector: 'app-inventory-equipment-widget',
  templateUrl: './inventory-equipment.widget.component.html',
  styleUrls: ['./inventory-equipment.widget.component.css'],
})
export class EquipmentWidgetComponent implements OnInit {
  @Input() equipment!: ActionableItemDefinition;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  private readonly basePath: string;

  readonly actionClass: { [key: string]: string };

  public icon?: string;
  public tooltip?: string;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.basePath = '../../../assets/icons';

    this.actionClass = {
      WEAR: 'wear-action',
      EQUIP: 'equip-action',
      READ: 'read-action',
      CONSUME: 'consume-action',
      USE: 'use-action',
      DROP: 'drop-action',
    };
  }

  private setIcon() {
    switch (this.equipment.action.actionable) {
      case 'WEAR':
        this.icon = `${this.basePath}/wear.svg`;
        this.tooltip = 'Wear';
        break;
      case 'EQUIP':
        this.icon = `${this.basePath}/equip.svg`;
        this.tooltip = 'Equip';
        break;
      case 'READ':
        this.icon = `${this.basePath}/read.svg`;
        this.tooltip = 'Read';
        break;
      case 'CONSUME':
        this.icon = `${this.basePath}/consume.svg`;
        this.tooltip = 'Consume';
        break;
      case 'USE':
        this.icon = `${this.basePath}/use.svg`;
        this.tooltip = 'Use';
        break;
      default:
        this.icon = `${this.basePath}/drop.svg`;
        this.tooltip = 'Drop';
        break;
    }
  }

  public ngOnInit() {
    this.setIcon();
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(
      new ActionableEvent(action, this.equipment.item.identity.name)
    );
  }
}
