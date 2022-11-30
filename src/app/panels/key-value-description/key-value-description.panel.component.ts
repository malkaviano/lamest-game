import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-key-value-description-panel',
  templateUrl: './key-value-description.panel.component.html',
  styleUrls: ['./key-value-description.panel.component.css'],
})
export class KeyValueDescriptionPanelComponent {
  @Input() public panelName!: string;
  @Input() public items: ArrayView<KeyValueDescriptionDefinition>;

  constructor() {
    this.items = new ArrayView([]);
  }
}
