import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquippedWidgetComponent } from './equipped.widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { ActionableEvent } from '@events/actionable.event';
import { unequipActionable } from '@definitions/actionable.definition';

import { simpleSword } from '../../../../tests/fakes';
import { testButtonEvent } from '../../../../tests/scenarios';

describe('EquippedWidgetComponent', () => {
  let component: EquippedWidgetComponent;
  let fixture: ComponentFixture<EquippedWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquippedWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EquippedWidgetComponent);

    component = fixture.componentInstance;

    component.item = simpleSword;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('remove', () => {
    it('should emit event', async () => {
      fixture.componentInstance.ngOnChanges();

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
