import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-window-panel',
  templateUrl: './window.panel.component.html',
  styleUrls: ['./window.panel.component.css'],
})
export class WindowPanelComponent {
  @Input() public keyValue!: KeyValueDescriptionDefinition;
}
