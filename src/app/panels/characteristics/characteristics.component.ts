import { Component, Input } from '@angular/core';
import { Characteristic } from '../../definitions/characteristic.definition';

@Component({
  selector: 'app-characteristics',
  templateUrl: './characteristics.component.html',
  styleUrls: ['./characteristics.component.css'],
})
export class CharacteristicsComponent {
  @Input() public characteristics!: Characteristic[];
}
