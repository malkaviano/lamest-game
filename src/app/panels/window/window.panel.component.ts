import { Component, Input } from '@angular/core';

import { KeyValueDescriptionView } from '../../model-views/key-value-description.view';

@Component({
  selector: 'app-window-panel',
  templateUrl: './window.panel.component.html',
  styleUrls: ['./window.panel.component.css'],
})
export class WindowPanelComponent {
  @Input() public keyValue!: KeyValueDescriptionView;
}
