import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Actionable } from '../../definitions/actionable.definition';
import { SelectedAction } from '../../definitions/selected-action.definition';

@Component({
  selector: 'app-actionable',
  templateUrl: './actionable.component.html',
  styleUrls: ['./actionable.component.css'],
})
export class ActionableComponent implements OnInit {
  @Input() actionable!: Actionable;
  @Output() onActionSelected: EventEmitter<SelectedAction>;

  constructor() {
    this.onActionSelected = new EventEmitter<SelectedAction>();
  }

  ngOnInit(): void {
    /* TODO document why this method 'ngOnInit' is empty */
  }

  actionSelected(id: string): void {
    this.onActionSelected.emit(new SelectedAction(id, this.actionable.id));
  }
}
