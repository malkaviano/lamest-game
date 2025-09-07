import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';
import { ActionableEvent } from '@events/actionable.event';
import { stripActionable, unequipActionable } from '@definitions/actionable.definition';

@Component({
  selector: 'app-tactical-status-panel',
  templateUrl: './tactical-status.panel.component.html',
  styleUrls: ['./tactical-status.panel.component.css'],
})
export class TacticalStatusPanelComponent {
  @Input() public status!: CharacterStatusView;
  @Input() public sceneLabel!: string;
  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public isCollapsed = false;

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public onUnequipWeapon(): void {
    const action = new ActionableEvent(unequipActionable, this.status.weapon.identity.name);
    this.actionSelected.emit(action);
  }

  public onUnequipArmor(): void {
    const action = new ActionableEvent(stripActionable, this.status.armor.identity.name);
    this.actionSelected.emit(action);
  }
}