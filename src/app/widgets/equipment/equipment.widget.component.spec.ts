import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { MaterialModule } from '../../../material/material.module';
import { EquipmentWidgetComponent } from './equipment.widget.component';
import { ActionableEvent } from '@conceptual/events/actionable.event';

import {
  actionableItemView,
  actionEquip,
  simpleSword,
} from '../../../../tests/fakes';

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
      actionEquip
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
      const button = await loader.getHarness(MatButtonHarness);

      let result: ActionableEvent | undefined;

      fixture.componentInstance.actionSelected
        .pipe(first())
        .subscribe((action: ActionableEvent) => {
          result = action;
        });

      await button.click();

      fixture.detectChanges();

      expect(result).toEqual(
        new ActionableEvent(actionEquip, simpleSword.identity.name)
      );
    });
  });
});
