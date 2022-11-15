import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-key-value-panel',
  templateUrl: './key-value-panel.component.html',
  styleUrls: ['./key-value-panel.component.css'],
})
export class KeyValuePanelComponent {
  @Input() public keyValues!: KeyValueDescriptionDefinition[];
}
