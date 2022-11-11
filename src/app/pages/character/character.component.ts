import { Component, Input, OnInit } from '@angular/core';
import { Characteristic } from '../../definitions/characteristic.definition';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
})
export class CharacterComponent implements OnInit {
  @Input() public characteristics!: Characteristic[];

  constructor(private readonly generator: GeneratorService) {}

  ngOnInit(): void {
    this.characteristics = this.generator.characteristics();
  }
}
