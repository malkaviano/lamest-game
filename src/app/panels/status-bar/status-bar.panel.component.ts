import { Component, Input } from '@angular/core';

import { CharacterStatusView } from '../../../backend/view-models/character-status.view';

@Component({
  selector: 'app-status-bar-panel',
  templateUrl: './status-bar.panel.component.html',
  styleUrls: ['./status-bar.panel.component.css'],
})
export class StatusBarPanelComponent {
  @Input() status!: CharacterStatusView;
}
