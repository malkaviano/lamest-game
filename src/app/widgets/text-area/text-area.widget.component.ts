import { Component, Input } from '@angular/core';

import { ArrayView } from '@wrappers/array.view';

@Component({
  selector: 'app-text-area-widget',
  templateUrl: './text-area.widget.component.html',
  styleUrls: ['./text-area.widget.component.css'],
})
export class TextAreaWidgetComponent {
  @Input()
  public paragraphs: ArrayView<string>;

  constructor() {
    this.paragraphs = ArrayView.empty();
  }
}
