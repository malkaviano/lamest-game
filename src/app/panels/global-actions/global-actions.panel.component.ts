import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionableEvent } from '@events/actionable.event';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { SceneEntity } from '@entities/scene.entity';
import { ViewableInterface } from '../../interfaces/viewable.interface';

@Component({
  selector: 'app-global-actions-panel',
  templateUrl: './global-actions.panel.component.html',
  styleUrls: ['./global-actions.panel.component.css'],
})
export class GlobalActionsPanelComponent {
  @Input() public status!: CharacterStatusView;
  @Input() public scene!: SceneEntity;
  @Output() public actionSelected = new EventEmitter<ActionableEvent>();
  @Output() public playerOptions = new EventEmitter<{
    readonly dodge?: boolean;
    readonly visible?: boolean;
  }>();
  @Output() public sceneOpened = new EventEmitter<ViewableInterface>();

  public isCollapsed = false;

  public get isVisible(): boolean {
    return this.status.visibility.value === 'VISIBLE';
  }


  public get hide() {
    return {
      icon: '../../../assets/icons/hide.svg',
      alt: 'Hide',
      tooltip: 'Hide from enemies',
      actionEvent: new ActionableEvent(
        createActionableDefinition('SKILL', 'Hide', 'Hide'),
        this.status.playerId
      ),
    };
  }

  public get visibility() {
    return {
      icon: '../../../assets/icons/visible.svg',
      alt: 'Become Visible',
      tooltip: 'Become visible',
    };
  }

  public get detect() {
    return {
      icon: '../../../assets/icons/detect.svg',
      alt: 'Detect',
      tooltip: 'Look around for hidden things',
      actionEvent: new ActionableEvent(
        createActionableDefinition('SKILL', 'Detect', 'Detect'),
        this.status.playerId
      ),
    };
  }

  public onChange(dodge: boolean): void {
    this.playerOptions.emit({ dodge });
  }

  public becomeVisible(): void {
    this.playerOptions.emit({ visible: true });
  }

  public get sceneImage(): ViewableInterface {
    return {
      title: this.scene.label,
      src: 'assets/images/' + this.scene.image,
      alt: this.scene.label,
      width: '400',
      height: '400'
    };
  }

  public openScene(): void {
    this.sceneOpened.emit(this.sceneImage);
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}