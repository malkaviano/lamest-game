import { Component, Input } from '@angular/core';

import { KeyValueDescriptionView } from '@core/view-models/key-value-description.view';

@Component({
  selector: 'app-window-widget',
  templateUrl: './window.widget.component.html',
  styleUrls: ['./window.widget.component.css'],
})
export class WindowWidgetComponent {
  @Input() public keyValue!: KeyValueDescriptionView;
}
