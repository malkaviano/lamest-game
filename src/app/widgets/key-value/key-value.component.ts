import { Component, Input, OnInit } from '@angular/core';

import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.css'],
})
export class KeyValueComponent {
  @Input() public keyValue!: KeyValueDescriptionDefinition;
}
