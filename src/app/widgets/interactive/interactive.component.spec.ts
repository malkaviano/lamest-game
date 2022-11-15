import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { InteractiveComponent } from './interactive.component';
import { MaterialModule } from '../../../material/material.module';
import { ArrayView } from '../../definitions/array-view.definition';
import { OpenedContainerState } from '../../states/opened-container.state';
import { InteractiveEntity } from '../../entities/interactive.entity';
import {
  ActionableDefinition,
  actionableDefinitions,
} from '../../definitions/actionable.definition';

let loader: HarnessLoader;

describe('InteractiveComponent', () => {
  let fixture: ComponentFixture<InteractiveComponent>;

  const interactive = new InteractiveEntity(
    'aid1',
    'Ornate Chest',
    'A brilliant chest',
    new OpenedContainerState('aid1', new ArrayView([]))
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

  it('should render title', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getTitleText()).toContain('Ornate Chest');
  });

  it('should render description', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getText()).toContain('A brilliant chest');
  });

  it('should render actions', async () => {
    const card = await loader.getHarness(MatCardHarness);

    const text = await card.getText();

    expect(text).toContain('Close');
    expect(text).toContain('Pick');
  });

  describe('clicking action button', () => {
    it('return the the actionable name and interactive id', async () => {
      const button = await loader.getHarness(MatButtonHarness);

      let result: ActionableDefinition | undefined;
      const expected = actionableDefinitions['CLOSE']('aid1', 'Close');

      fixture.componentInstance.onActionSelected
        .pipe(first())
        .subscribe((action: ActionableDefinition) => {
          result = action;

          expect(result).toEqual(expected);
        });

      await button.click();

      fixture.detectChanges();
    });
  });
});
