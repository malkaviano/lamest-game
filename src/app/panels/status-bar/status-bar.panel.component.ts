import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class StatusBarPanelComponent implements OnInit {
  @Input() status!: CharacterStatusView;

  @Output() actionSelected: EventEmitter<ActionableEvent>;

  @Output() dodgeOption: EventEmitter<{ dodge: boolean }>;

  public disguise!: Action;

  constructor() {
    this.actionSelected = new EventEmitter<ActionableEvent>();

    this.dodgeOption = new EventEmitter<{ dodge: boolean }>();
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
  }

  onChange(dodge: boolean) {
    this.dodgeOption.emit({ dodge });
  }
}
