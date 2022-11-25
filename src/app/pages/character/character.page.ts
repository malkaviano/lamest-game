import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../views/array.view';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { ConverterHelper } from '../../helpers/converter.helper';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-page',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.css'],
})
export class CharacterPage implements OnInit {
  public identityView!: ArrayView<KeyValueDescriptionDefinition>;
  public characteristicsView!: ArrayView<KeyValueDescriptionDefinition>;
  public derivedAttributesView!: ArrayView<KeyValueDescriptionDefinition>;
  public skillsView!: ArrayView<KeyValueDescriptionDefinition>;

  constructor(
    private readonly characterManagerService: CharacterService,
    private readonly converterHelper: ConverterHelper
  ) {}

  ngOnInit(): void {
    const character = this.characterManagerService.randomCharacter;

    const characterValues =
      this.converterHelper.characterToKeyValueDescription(character);

    this.identityView = characterValues.identity;

    this.characteristicsView = characterValues.characteristics;

    this.derivedAttributesView = characterValues.derivedAttributes;

    this.skillsView = characterValues.skills;
  }
}
