import { Component } from '@angular/core';
import { Actionable } from './definitions/actionable.definition';
import { ActionSelection } from './definitions/action-selection.definition';
import { SelectedAction } from './definitions/selected-action.definition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lamest-game';

  text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis eros arcu, at bibendum metus pellentesque a. Phasellus vulputate, justo eu volutpat tempor, tellus velit dignissim orci, vitae placerat justo tortor quis nunc. Vestibulum scelerisque quis neque sit amet varius. Maecenas iaculis tellus ultrices tortor cursus, cursus commodo turpis ultricies. Cras scelerisque vel dolor mattis finibus. Cras at elementum dui. Donec lacinia vel est non ultricies. Integer egestas rhoncus dolor sit amet fermentum. Sed a tincidunt nulla. Cras nec ipsum id arcu eleifend ullamcorper sed at est. Nam interdum lectus nec accumsan consequat. Curabitur id dui sit amet massa sagittis hendrerit. Nullam sollicitudin faucibus mauris, quis semper erat posuere vel.' +
    '\n' +
    'Mauris in nibh sed ligula volutpat tempor. Vestibulum facilisis a ante id luctus. Morbi nec turpis urna. Donec eleifend fermentum purus, sed hendrerit nibh blandit quis. Aliquam et turpis elit. Donec aliquam mauris id pharetra accumsan. Sed eu felis sed odio vestibulum sagittis et vitae orci. Nam sodales vel augue eget bibendum. Mauris sed arcu justo. Etiam tincidunt ultrices odio non malesuada. Duis molestie dignissim viverra. Praesent gravida vestibulum lorem, at ornare lorem eleifend sed. Donec leo nibh, rutrum sed risus vel, vestibulum condimentum arcu.' +
    '\n' +
    'Suspendisse id eros vitae ligula ornare fermentum nec nec lorem. Cras eu imperdiet nulla, id tristique turpis. Maecenas arcu tellus, sodales eget est eu, euismod suscipit metus. In feugiat auctor tempor. Curabitur tincidunt rutrum magna, et luctus dolor gravida vitae. Donec ultricies tellus sed ante accumsan fermentum. Nam posuere risus justo, mollis fermentum metus luctus non. In sed urna at tortor tempus hendrerit. Sed at arcu in ligula aliquet dignissim non at lectus. Morbi molestie nulla sed nisl lacinia egestas. Phasellus bibendum ex quis felis interdum, nec fermentum nunc maximus. Aenean sollicitudin lacus id sapien tristique, vitae feugiat mauris molestie. Mauris sit amet fermentum ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse sit amet nunc sed diam suscipit gravida non in justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.' +
    '\n' +
    'Pellentesque viverra quam eu lobortis volutpat. Pellentesque dui turpis, accumsan sed venenatis et, blandit a erat. Integer quis laoreet purus, ut hendrerit erat. Phasellus ut pretium libero, nec faucibus orci. Sed nec consectetur nibh. Praesent id interdum magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat posuere enim, mattis pellentesque diam viverra ut. Etiam rutrum sed lorem in consectetur.';

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
