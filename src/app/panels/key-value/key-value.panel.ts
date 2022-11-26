import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-key-value-panel',
  templateUrl: './key-value.panel.html',
  styleUrls: ['./key-value.panel.css'],
})
export class KeyValuePanel {
  @Input() public panelName!: string;
  @Input() public items: ArrayView<KeyValueDescriptionDefinition>;

  constructor() {
    this.items = new ArrayView([]);
  }
}
