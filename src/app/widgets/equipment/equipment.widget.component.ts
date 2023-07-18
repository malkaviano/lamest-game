import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ActionableEvent } from '@events/actionable.event';

@Component({
  selector: 'app-equipment-widget',
  templateUrl: './equipment.widget.component.html',
  styleUrls: ['./equipment.widget.component.css'],
})
export class EquipmentWidgetComponent implements OnInit {
  @Input() equipment!: ActionableItemDefinition;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  private readonly basePath: string;

  public icon?: string;
  public tooltip?: string;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.basePath = '../../../assets/icons';
  }

  private setIcon() {
    switch (this.equipment.action.actionable) {
      case 'WEAR':
        this.icon = `${this.basePath}/wear.svg`;
        this.tooltip = 'WEAR';
        break;
      case 'EQUIP':
        this.icon = `${this.basePath}/equip.svg`;
        this.tooltip = 'EQUIP';
        break;
      case 'READ':
        this.icon = `${this.basePath}/read.svg`;
        this.tooltip = 'READ';
        break;
      case 'CONSUME':
        this.icon = `${this.basePath}/consume.svg`;
        this.tooltip = 'CONSUME';
        break;
      default:
        this.icon = `${this.basePath}/drop.svg`;
        this.tooltip = 'DROP';
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
