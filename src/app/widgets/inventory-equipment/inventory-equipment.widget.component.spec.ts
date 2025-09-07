import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { MaterialModule } from '../../../material/material.module';
import { EquipmentWidgetComponent } from './inventory-equipment.widget.component';
import { ActionableEvent } from '@events/actionable.event';
import {
  dropActionable,
  equipActionable,
} from '@definitions/actionable.definition';

import { actionableItemView, simpleSword } from '../../../../tests/fakes';
import { testButtonEvent } from '../../../../tests/scenarios';

describe('EquipmentWidgetComponent', () => {
  let component: EquipmentWidgetComponent;
  let fixture: ComponentFixture<EquipmentWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentWidgetComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentWidgetComponent);

    fixture.componentInstance.equipment = actionableItemView(
      simpleSword,
      equipActionable
    );

    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking action button', () => {
    it('return the the actionable name and item name', async () => {
      const result = await testButtonEvent(loader, fixture);

      expect(result).toEqual(
        new ActionableEvent(equipActionable, simpleSword.identity.name)
      );
    });
  });

  it('renders two buttons: primary + drop', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
  });

  it('clicking drop emits drop actionable for the item', async () => {
    const result = await testButtonEvent(loader, fixture, 1);
    expect(result).toEqual(
      new ActionableEvent(dropActionable, simpleSword.identity.name)
    );
  });
});
