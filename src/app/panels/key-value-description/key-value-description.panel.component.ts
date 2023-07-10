import { Component, Input } from '@angular/core';

import { ArrayView } from '@wrappers/array.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';

@Component({
  selector: 'app-key-value-description-panel',
  templateUrl: './key-value-description.panel.component.html',
  styleUrls: ['./key-value-description.panel.component.css'],
})
export class KeyValueDescriptionPanelComponent {
  @Input() public panelName!: string;
  @Input() public items: ArrayView<KeyValueDescriptionView>;

  constructor() {
    this.items = ArrayView.empty();
  }
}
