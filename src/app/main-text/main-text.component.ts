import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-text',
  templateUrl: './main-text.component.html',
  styleUrls: ['./main-text.component.css'],
})
export class MainTextComponent {
  public paragraphs: string[];

  @Input() set text(value: string) {
    this.paragraphs = value.split('\n');
  }

  constructor() {
    this.paragraphs = [];
  }
}
