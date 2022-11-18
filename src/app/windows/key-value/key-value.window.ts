import { Component, Input } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-key-value-window',
  templateUrl: './key-value.window.html',
  styleUrls: ['./key-value.window.css'],
})
export class KeyValueWindow {
  @Input() public keyValue!: KeyValueDescriptionDefinition;
}
