import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ViewableInterface } from '../../../core/interfaces/viewable.interface';

@Component({
  selector: 'app-viewer-dialog',
  templateUrl: './viewer.dialog.component.html',
  styleUrls: ['./viewer.dialog.component.css'],
})
export class ViewerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ViewableInterface
  ) {}
}
