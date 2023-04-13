import { Component, Input } from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';

@Component({
  selector: 'app-status-bar-widget',
  templateUrl: './status-bar.widget.component.html',
  styleUrls: ['./status-bar.widget.component.css'],
})
export class StatusBarWidgetComponent {
  @Input() status!: CharacterStatusView;
}
