import { Component, Input } from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';

@Component({
  selector: 'app-tactical-status-panel',
  templateUrl: './tactical-status.panel.component.html',
  styleUrls: ['./tactical-status.panel.component.css'],
})
export class TacticalStatusPanelComponent {
  @Input() public status!: CharacterStatusView;
}