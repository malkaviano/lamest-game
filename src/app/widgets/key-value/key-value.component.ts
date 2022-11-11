import { Component, Input, OnInit } from '@angular/core';

import { KeyValue } from '../../definitions/key-value.definition';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.css'],
})
export class KeyValueComponent {
  @Input() public keyValue!: KeyValue;
}
