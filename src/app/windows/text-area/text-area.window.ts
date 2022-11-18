import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-area-window',
  templateUrl: './text-area.window.html',
  styleUrls: ['./text-area.window.css'],
})
export class TextAreaWindow {
  @Input()
  public paragraphs: string[];

  constructor() {
    this.paragraphs = [];
  }
}
