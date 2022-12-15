import { Component, Input } from '@angular/core';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-text-area-panel',
  templateUrl: './text-area.panel.component.html',
  styleUrls: ['./text-area.panel.component.css'],
})
export class TextAreaPanelComponent {
  @Input()
  public paragraphs: ArrayView<string>;

  constructor() {
    this.paragraphs = ArrayView.create([]);
  }
}
