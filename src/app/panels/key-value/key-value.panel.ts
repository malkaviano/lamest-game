import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-key-value-panel',
  templateUrl: './key-value.panel.html',
  styleUrls: ['./key-value.panel.css'],
})
export class KeyValuePanel {
  @Input() public keyValues!: KeyValueDescriptionDefinition[];
}
