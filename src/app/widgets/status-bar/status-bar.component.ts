import { Component, Input } from '@angular/core';

import { CharacterStatusView } from '../../model-views/character-status';

@Component({
  selector: 'app-status-bar-widget',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css'],
})
export class StatusBarComponent {
  @Input() status!: CharacterStatusView;
}
