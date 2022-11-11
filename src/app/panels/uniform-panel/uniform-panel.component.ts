import { Component, Input } from '@angular/core';

import { KeyValue } from '../../definitions/key-value.definition';

@Component({
  selector: 'app-uniform-panel',
  templateUrl: './uniform-panel.component.html',
  styleUrls: ['./uniform-panel.component.css'],
})
export class UniformPanelComponent {
  @Input() public keyValues!: KeyValue[];
}
