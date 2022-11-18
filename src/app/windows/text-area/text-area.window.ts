import { Component, Input } from '@angular/core';
import { ArrayView } from '../../views/array.view';

@Component({
  selector: 'app-text-area-window',
  templateUrl: './text-area.window.html',
  styleUrls: ['./text-area.window.css'],
})
export class TextAreaWindow {
  @Input()
  public paragraphs: ArrayView<string>;

  constructor() {
    this.paragraphs = new ArrayView([]);
  }
}
