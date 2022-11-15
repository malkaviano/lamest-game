import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { instance, mock, when } from 'ts-mockito';
import { first, of } from 'rxjs';

import { InteractiveComponent } from './interactive.component';
import { MaterialModule } from '../../../material/material.module';
import { InteractiveEntity } from '../../entities/interactive.entity';
import {
  ActionableDefinition,
  actionableDefinitions,
} from '../../definitions/actionable.definition';
import { ArrayView } from '../../definitions/array-view.definition';

let loader: HarnessLoader;

const mockedInteractive = mock(InteractiveEntity);

const expected = actionableDefinitions['CLOSE']('id1', 'close', 'Close');

describe('InteractiveComponent', () => {
  let fixture: ComponentFixture<InteractiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveComponent);

    fixture.componentInstance.interactive = instance(mockedInteractive);

    loader = TestbedHarnessEnvironment.loader(fixture);

    when(mockedInteractive.actionsChanged$).thenReturn(of());
    when(mockedInteractive.name).thenReturn('Ornate Chest');
    when(mockedInteractive.description).thenReturn('A brilliant chest');
    when(mockedInteractive.actionsChanged$).thenReturn(
      of(
        new ArrayView([
          expected,
          new ActionableDefinition('PICK', 'pick', 'Pick', 'id1'),
        ])
      )
    );
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
