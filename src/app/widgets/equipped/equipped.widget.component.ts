import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { GameItemDefinition } from '@definitions/game-item.definition';
import { ActionableEvent } from '@events/actionable.event';
import {
  stripActionable,
  unequipActionable,
} from '@definitions/actionable.definition';

@Component({
  selector: 'app-equipped-widget',
  templateUrl: './equipped.widget.component.html',
  styleUrls: ['./equipped.widget.component.css'],
})
export class EquippedWidgetComponent implements OnChanges {
  private action!: ActionableEvent;

  @Input() item!: GameItemDefinition;
  @Output() actionSelected: EventEmitter<ActionableEvent>;

  public tooltip!: string;

  public icon!: string;

  public alt!: string;

  public showButton: boolean;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.icon = '../../../assets/icons/remove.svg';

    this.showButton = false;
  }

  ngOnChanges(): void {
    this.showButton =
      this.item.identity.name !== 'clothArmor' &&
      this.item.identity.name !== 'unarmedWeapon';

    if (this.item.category === 'WEAPON') {
      this.tooltip = 'Unequip weapon';
      this.alt = 'UNEQUIP WEAPON';

      this.action = new ActionableEvent(
        unequipActionable,
        this.item.identity.name
      );
    } else if (this.item.category === 'ARMOR') {
      this.tooltip = 'Strip armor';
      this.alt = 'STRIP ARMOR';

      this.action = new ActionableEvent(
        stripActionable,
        this.item.identity.name
      );
    }
  }

  onActionSelected(): void {
    this.actionSelected.emit(this.action);
  }
}
