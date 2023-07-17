import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';

export const ruleScenario = (
  service: RuleAbstraction,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleExtrasInterface,
  expected: LogMessageDefinition[],
  done: DoneFn
) => {
  const result: LogMessageDefinition[] = [];

  service.logMessageProduced$.subscribe((event) => {
    result.push(event);
  });

  done();

  service.execute(actor, actionableEvent, extras);

  expect(result).toEqual(expected);
};

export async function testButtonEvent(
  loader: HarnessLoader,
  fixture: ComponentFixture<{ actionSelected: EventEmitter<ActionableEvent> }>,
  index = 0
) {
  const buttons = await loader.getAllHarnesses(MatButtonHarness);

  let result: ActionableEvent | undefined;

  fixture.componentInstance.actionSelected
    .pipe(first())
    .subscribe((action: ActionableEvent) => {
      result = action;
    });

  await buttons[index].click();

  fixture.detectChanges();

  return result;
}
