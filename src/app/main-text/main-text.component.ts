import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-text',
  templateUrl: './main-text.component.html',
  styleUrls: ['./main-text.component.css'],
})
export class MainTextComponent {
  @Input()
  public paragraphs: string[];

  constructor() {
    this.paragraphs = [];
  }
}
