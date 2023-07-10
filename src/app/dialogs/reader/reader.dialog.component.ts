import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ReadableInterface } from '@conceptual/interfaces/readable.interface';

@Component({
  selector: 'app-reader-dialog',
  templateUrl: './reader.dialog.component.html',
  styleUrls: ['./reader.dialog.component.css'],
})
export class ReaderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ReadableInterface
  ) {}
}
