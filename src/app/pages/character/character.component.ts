import { Component, Input, OnInit } from '@angular/core';
import { KeyValue } from '../../definitions/key-value.definition';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
})
export class CharacterComponent implements OnInit {
  @Input() public identities!: KeyValue[];
  @Input() public characteristics!: KeyValue[];

  constructor(private readonly generator: GeneratorService) {}

  ngOnInit(): void {
    // TODO: Move to a service
    this.identities = [
      new KeyValue('Name', this.generator.name(), 'Character name'),
      new KeyValue(
        'Profession',
        this.generator.profession(),
        'Character profession'
      ),
      new KeyValue('Gender', this.generator.gender(), 'Character gender'),
      new KeyValue('Age', this.generator.age(), 'Character age'),
      new KeyValue('Race', this.generator.race(), 'Character race'),
      new KeyValue('Height', this.generator.height(), 'Character height'),
      new KeyValue('Weight', this.generator.weight(), 'Character weight'),
    ];

    this.characteristics = this.generator.characteristics();
  }
}
