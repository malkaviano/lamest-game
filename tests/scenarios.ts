import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { RuleValues } from '@values/rule.value';
import { RuleResult } from '@results/rule.result';
import { PolicyResult } from '@results/policy.result';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyValues } from '@values/policy.values';
import { ArrayView } from '@wrappers/array.view';

export const ruleScenario = (
  service: RuleAbstraction,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleValues,
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

export function testPolicy(
  policy: PolicyAbstraction,
  ruleResult: RuleResult,
  expected: PolicyResult,
  logs: LogMessageDefinition[],
  values: PolicyValues = { invisibleInteractives: ArrayView.empty() }
) {
  it('return policy result', () => {
    const result = policy.enforce(ruleResult, values);

    expect(result).toEqual(expected);
  });

  it('logs', () => {
    const result: LogMessageDefinition[] = [];

    policy.logMessageProduced$.subscribe((event) => {
      result.push(event);
    });

    policy.enforce(ruleResult, values);

    expect(result).toEqual(logs);
  });
}
