import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../definitions/array-view.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { ConverterHelper } from '../../helpers/converter.helper';
import { CharacterManagerService } from '../../services/character-manager.service';

@Component({
  selector: 'app-character',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css'],
})
export class CharacterPageComponent implements OnInit {
  public identityView!: ArrayView<KeyValueDescriptionDefinition>;
  public characteristicsView!: ArrayView<KeyValueDescriptionDefinition>;
  public derivedAttributesView!: ArrayView<KeyValueDescriptionDefinition>;
  public skillsView!: ArrayView<KeyValueDescriptionDefinition>;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
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
