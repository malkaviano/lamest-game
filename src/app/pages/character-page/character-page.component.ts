import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../definitions/array-view.definition';
import { KeyValueDescription } from '../../definitions/key-value-description.definition';
import { CharacterService } from '../../services/character.service';
import { FormatterService } from '../../services/formatter.service';

@Component({
  selector: 'app-character',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css'],
})
export class CharacterPageComponent implements OnInit {
  public identityView!: ArrayView<KeyValueDescription>;
  public characteristicsView!: ArrayView<KeyValueDescription>;
  public derivedAttributesView!: ArrayView<KeyValueDescription>;

  constructor(
    private readonly characterService: CharacterService,
    private readonly formatterService: FormatterService
  ) {}

  ngOnInit(): void {
    const identity = this.characterService.identity();

    this.identityView = new ArrayView(
      Object.values(identity).map(this.formatterService.toKeyValueDescription)
    );

    const characteristics = this.characterService.characteristics();

    this.characteristicsView = new ArrayView(
      Object.values(characteristics).map(
        this.formatterService.toKeyValueDescription
      )
    );

    const derivedAttributes = this.characterService.attributes(characteristics);

    this.derivedAttributesView = new ArrayView(
      Object.values(derivedAttributes).map(
        this.formatterService.toKeyValueDescription
      )
    );
  }
}
