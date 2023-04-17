import { Component, OnInit } from '@angular/core';

import { KeyValueDescriptionView } from '../../../backend/view-models/key-value-description.view';
import { ArrayView } from '../../../backend/view-models/array.view';
import { CharacterService } from '../../../backend/services/character.service';
import { FormatterHelperService } from '../../../backend/helpers/formatter.helper.service';

@Component({
  selector: 'app-character-page',
  templateUrl: './character.page.component.html',
  styleUrls: ['./character.page.component.css'],
})
export class CharacterPageComponent implements OnInit {
  public identityView!: ArrayView<KeyValueDescriptionView>;
  public characteristicsView!: ArrayView<KeyValueDescriptionView>;
  public derivedAttributesView!: ArrayView<KeyValueDescriptionView>;
  public skillsView!: ArrayView<KeyValueDescriptionView>;

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
