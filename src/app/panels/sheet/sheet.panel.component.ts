import { Component, Input } from '@angular/core';

import { CharacterValuesView } from '../../view-models/character-values.view';

@Component({
  selector: 'app-sheet-panel',
  templateUrl: './sheet.panel.component.html',
  styleUrls: ['./sheet.panel.component.css'],
})
export class SheetPanelComponent {
  @Input() characterValues!: CharacterValuesView;
}
