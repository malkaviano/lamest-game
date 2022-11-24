import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { MaterialModule } from '../../../material/material.module';
import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import { DamageDefinition } from '../../definitions/damage.definition';
import { createDice } from '../../definitions/dice.definition';
import { WeaponDefinition } from '../../definitions/weapon.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { EquipmentWidget } from './equipment.widget';

describe('EquipmentWidget', () => {
  let component: EquipmentWidget;
  let fixture: ComponentFixture<EquipmentWidget>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentWidget],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentWidget);

    fixture.componentInstance.equipment = actionableItem;

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

      fixture.componentInstance.onActionSelected
        .pipe(first())
        .subscribe((action: ActionableEvent) => {
          result = action;

          expect(result).toEqual(new ActionableEvent(equipAction, 'sword'));
        });

      await button.click();

      fixture.detectChanges();
    });
  });
});

const equipAction = createActionableDefinition('EQUIP', 'equip', 'Equip');

const actionableItem = new ActionableItemDefinition(
  new WeaponDefinition(
    'sword',
    'Long Sword',
    'Some big sword',
    'Melee Weapon (Simple)',
    new DamageDefinition(createDice({ D8: 1 }), 0)
  ),
  equipAction
);
