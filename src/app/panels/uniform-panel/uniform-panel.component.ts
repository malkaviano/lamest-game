import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-uniform-panel',
  templateUrl: './uniform-panel.component.html',
  styleUrls: ['./uniform-panel.component.css'],
})
export class UniformPanelComponent {
  @Input() public keyValues!: KeyValueDescriptionDefinition[];
}
