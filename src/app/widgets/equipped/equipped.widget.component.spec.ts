import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { MaterialModule } from '../../../material/material.module';
import { ActionableEvent } from '../../events/actionable.event';
import { EquippedWidgetComponent } from './equipped.widget.component';
import { unarmedWeapon } from '../../value-objects/weapons/manual-weapon.vobject';

import { actionUnEquip, simpleSword } from '../../../../tests/fakes';

describe('EquippedWidgetComponent', () => {
  let component: EquippedWidgetComponent;
  let fixture: ComponentFixture<EquippedWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquippedWidgetComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EquippedWidgetComponent);

    component = fixture.componentInstance;

    component.equipped = unarmedWeapon;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking action button', () => {
    it('return the the actionable unequip and item name', async () => {
      fixture.componentInstance.equipped = simpleSword;

      fixture.detectChanges();

      const button = await loader.getHarness(MatButtonHarness);

      let result: ActionableEvent | undefined;

      fixture.componentInstance.actionSelected
        .pipe(first())
        .subscribe((action: ActionableEvent) => {
          result = action;

          expect(result).toEqual(
            new ActionableEvent(
              actionUnEquip(simpleSword.identity.label),
              simpleSword.identity.name
            )
          );
        });

      await button.click();

      fixture.detectChanges();
    });
  });
});
