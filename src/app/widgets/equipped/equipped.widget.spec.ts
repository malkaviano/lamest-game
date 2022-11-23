import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { MaterialModule } from '../../../material/material.module';
import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import { WeaponDefinition } from '../../definitions/weapon.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { EquippedWidget } from './equipped.widget';

describe('EquippedWidgetComponent', () => {
  let component: EquippedWidget;
  let fixture: ComponentFixture<EquippedWidget>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquippedWidget],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EquippedWidget);

    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking action button', () => {
    it('return the the actionable unequip and item name', async () => {
      fixture.componentInstance.equipped = item;

      fixture.detectChanges();

      const button = await loader.getHarness(MatButtonHarness);

      let result: ActionableEvent | undefined;

      fixture.componentInstance.onActionSelected
        .pipe(first())
        .subscribe((action: ActionableEvent) => {
          result = action;

          expect(result).toEqual(new ActionableEvent(unequipAction, 'sword'));
        });

      await button.click();

      fixture.detectChanges();
    });
  });
});

const unequipAction = createActionableDefinition(
  'UNEQUIP',
  'unequip',
  'Bastard Sword'
);

const item = new WeaponDefinition('sword', 'Bastard Sword', 'Some big sword');

const actionableItem = new ActionableItemDefinition(item, unequipAction);