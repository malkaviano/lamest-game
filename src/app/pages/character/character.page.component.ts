import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../views/array.view';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { CharacterService } from '../../services/character.service';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';

@Component({
  selector: 'app-character-page',
  templateUrl: './character.page.component.html',
  styleUrls: ['./character.page.component.css'],
})
export class CharacterPageComponent implements OnInit {
  public identityView!: ArrayView<KeyValueDescriptionDefinition>;
  public characteristicsView!: ArrayView<KeyValueDescriptionDefinition>;
  public derivedAttributesView!: ArrayView<KeyValueDescriptionDefinition>;
  public skillsView!: ArrayView<KeyValueDescriptionDefinition>;

  constructor(
    private readonly characterService: CharacterService,
    private readonly formatterHelperService: FormatterHelperService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.randomCharacter;

    const characterValues =
      this.formatterHelperService.characterToKeyValueDescription(character);

    this.identityView = characterValues.identity;

    this.characteristicsView = characterValues.characteristics;

    this.derivedAttributesView = characterValues.derivedAttributes;

    this.skillsView = characterValues.skills;
  }
}
