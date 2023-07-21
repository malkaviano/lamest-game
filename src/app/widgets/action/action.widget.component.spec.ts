import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActionWidgetComponent } from './action.widget.component';
import { ActionableEvent } from '@events/actionable.event';
import {
  equipActionable,
  unequipActionable,
} from '@definitions/actionable.definition';

import { testButtonEvent } from '../../../../tests/scenarios';
import { simpleSword } from '../../../../tests/fakes';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ActionWidgetComponent', () => {
  let component: ActionWidgetComponent;
  let fixture: ComponentFixture<ActionWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionWidgetComponent);

    component = fixture.componentInstance;

    component.actionEvent = new ActionableEvent(
      unequipActionable,
      simpleSword.identity.name
    );

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click', () => {
    it('should emit event', async () => {
      const result: ActionableEvent | undefined = await testButtonEvent(
        loader,
        fixture
      );

      expect(result).toEqual(
        new ActionableEvent(unequipActionable, simpleSword.identity.name)
      );
    });
  });
});
