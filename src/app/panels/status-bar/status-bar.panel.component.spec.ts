import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { StatusBarPanelComponent } from './status-bar.panel.component';
import { ActionableEvent } from '@events/actionable.event';
import {
  stripActionable,
  unequipActionable,
} from '@definitions/actionable.definition';

import {
  fakeCharacterStatusView,
  leatherJacket,
  simpleSword,
} from '../../../../tests/fakes';
import { testButtonEvent } from '../../../../tests/scenarios';

describe('StatusBarPanelComponent', () => {
  let component: StatusBarPanelComponent;
  let fixture: ComponentFixture<StatusBarPanelComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBarPanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBarPanelComponent);
    component = fixture.componentInstance;

    component.status = fakeCharacterStatusView;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('unequip', () => {
    it('should emit event', async () => {
      const result: ActionableEvent | undefined = await testButtonEvent(
        loader,
        fixture,
        0
      );

      expect(result).toEqual(
        new ActionableEvent(unequipActionable, simpleSword.identity.name)
      );
    });
  });

  describe('strip', () => {
    it('should emit event', async () => {
      const result: ActionableEvent | undefined = await testButtonEvent(
        loader,
        fixture,
        1
      );

      expect(result).toEqual(
        new ActionableEvent(stripActionable, leatherJacket.identity.name)
      );
    });
  });
});
