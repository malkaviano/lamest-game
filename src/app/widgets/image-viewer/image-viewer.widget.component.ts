import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ViewableInterface } from '@core/interfaces/viewable.interface';

@Component({
  selector: 'app-image-viewer-widget',
  templateUrl: './image-viewer.widget.component.html',
  styleUrls: ['./image-viewer.widget.component.css'],
})
export class ImageViewerComponent {
  @Input() image!: ViewableInterface;
  @Output() imageOpened: EventEmitter<ViewableInterface>;

  constructor() {
    this.imageOpened = new EventEmitter<ViewableInterface>();
  }

  onImageOpened(): void {
    this.imageOpened.emit(this.image);
  }
}
