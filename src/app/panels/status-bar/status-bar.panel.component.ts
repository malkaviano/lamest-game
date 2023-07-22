import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import { CharacterStatusView } from '../../view-models/character-status.view';
import { ActionableEvent } from '@events/actionable.event';
import { createActionableDefinition } from '@definitions/actionable.definition';

type Action = {
  readonly icon: string;
  readonly alt: string;
  readonly tooltip: string;
  readonly actionEvent: ActionableEvent;
};

@Component({
  selector: 'app-status-bar-panel',
  templateUrl: './status-bar.panel.component.html',
  styleUrls: ['./status-bar.panel.component.css'],
})
export class StatusBarPanelComponent implements OnInit, OnChanges {
  @Input() status!: CharacterStatusView;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Output() playerOptions: EventEmitter<{
    readonly dodge?: boolean;
    readonly visible?: boolean;
  }>;

  public disguise!: Action;

  public hide!: Action;

  public detect!: Action;

  public visibility!: Omit<Action, 'actionEvent'>;

  public isVisible!: boolean;

  constructor() {
    this.actionSelected = new EventEmitter();

    this.playerOptions = new EventEmitter();
  }

  ngOnChanges(): void {
    this.isVisible = this.status.visibility.value.toUpperCase() === 'VISIBLE';
  }

  ngOnInit(): void {
    this.disguise = {
      icon: '../../../assets/icons/disguise.svg',
      tooltip: 'Disguise yourself',
      alt: 'DISGUISE',
      actionEvent: new ActionableEvent(
        createActionableDefinition('USE', 'disguise'),
        this.status.playerId
      ),
    };

    this.hide = {
      icon: '../../../assets/icons/hide.svg',
      tooltip: 'Hide yourself',
      alt: 'HIDE',
      actionEvent: new ActionableEvent(
        createActionableDefinition('SKILL', 'Hide'),
        this.status.playerId
      ),
    };

    this.detect = {
      icon: '../../../assets/icons/detect.svg',
      tooltip: 'Detect hidden or disguised',
      alt: 'DETECT',
      actionEvent: new ActionableEvent(
        createActionableDefinition('SKILL', 'Detect'),
        this.status.playerId
      ),
    };

    this.visibility = {
      icon: '../../../assets/icons/visible.svg',
      tooltip: 'Show yourself',
      alt: 'VISIBLE',
    };
  }

  public onChange(dodge: boolean) {
    this.playerOptions.emit({ dodge });
  }

  public becomeVisible() {
    this.playerOptions.emit({ visible: true });
  }
}
