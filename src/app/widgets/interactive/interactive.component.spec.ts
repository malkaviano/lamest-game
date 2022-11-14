import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { InteractiveComponent } from './interactive.component';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { MaterialModule } from '../../../material/material.module';
import { ActionSelected } from '../../definitions/action-selected.definition';
import { SelectedActionEvent } from '../../events/selected-action.event';

let loader: HarnessLoader;

describe('InteractiveComponent', () => {
  let fixture: ComponentFixture<InteractiveComponent>;

  const interactive = new InteractiveEntity(
    'aid1',
    'Action1',
    'Simple action to be performed',
    [
      new ActionSelected('id1', 'Do it'),
      new ActionSelected('id2', "Don't do it"),
    ]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveComponent);

    fixture.componentInstance.interactive = interactive;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', async () => {
    expect(await loader.getHarness(MatCardHarness)).toBeTruthy();
  });

  it('should render description', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getText()).toContain('Simple action to be performed');
  });

  it('should render actions', async () => {
    const card = await loader.getHarness(MatCardHarness);

    const text = await card.getText();

    expect(text).toContain('Do it');
    expect(text).toContain("Don't do it");
  });

  describe('clicking action button', () => {
    it('return the the actionable id and selected action id', async () => {
      const button = await loader.getHarness(MatButtonHarness);

      let result: SelectedActionEvent | undefined;
      const expected = new SelectedActionEvent('id1', 'aid1');

      fixture.componentInstance.onActionSelected
        .pipe(first())
        .subscribe((action: SelectedActionEvent) => (result = action));

      await button.click();

      expect(result).toEqual(expected);
    });
  });
});
