import { Component, Input } from '@angular/core';

import { Characteristic } from '../../definitions/characteristic.definition';

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.css'],
})
export class CharacteristicComponent {
  @Input() public characteristic!: Characteristic;

  public label(): string {
    return this.characteristic.name.toLowerCase();
  }
}
