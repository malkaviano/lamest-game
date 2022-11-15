import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css'],
})
export class TextBoxComponent {
  @Input()
  public paragraphs: string[];

  constructor() {
    this.paragraphs = [];
  }
}
