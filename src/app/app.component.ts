import { Component } from '@angular/core';
import { Actionable } from '../definitions/actionable.definition';
import { ActionSelection } from '../definitions/action-selection.definition';
import { SelectedAction } from '../definitions/selected-action.definition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lamest-game';

  actionables = [
    new Actionable(
      'aid1',
      'Action1',
      'Simple action to be performed',
      'This is the long description about the actionable',
      [
        new ActionSelection('id1', 'Do it'),
        new ActionSelection('id2', "Don't do it"),
      ]
    ),
    new Actionable(
      'aid2',
      'Action2',
      'Simple action to be performed',
      'This is the long description about the actionable',
      [
        new ActionSelection('id1', 'Do it'),
        new ActionSelection('id2', "Don't do it"),
        new ActionSelection('id3', 'Forget IT!!!'),
      ]
    ),
  ];

  actionSelected(event: SelectedAction): void {
    console.log(event);
  }
}
