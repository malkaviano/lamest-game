import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { InteractiveWidgetComponent } from './interactive.widget.component';
import { MaterialModule } from '../../../material/material.module';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';

import { testButtonEvent } from '../../../../tests/scenarios';

describe('InteractiveWidgetComponent', () => {
  let fixture: ComponentFixture<InteractiveWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveWidgetComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveWidgetComponent);

    fixture.componentInstance.interactive = instance(mockedInteractive);

    loader = TestbedHarnessEnvironment.loader(fixture);

    when(mockedInteractive.actionsChanged$).thenReturn(of());
    when(mockedInteractive.id).thenReturn('id1');
    when(mockedInteractive.name).thenReturn('Ornate Chest');
    when(mockedInteractive.description).thenReturn('A brilliant chest');
    when(mockedInteractive.actionsChanged$).thenReturn(
      of(ArrayView.create(consumeAction, pickAction))
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

    expect(text).toContain('Consume');
    expect(text).toContain('Pick');
  });

  describe('clicking action button', () => {
    it('return the the actionable name and interactive id', async () => {
      const result = await testButtonEvent(loader, fixture);

      expect(result).toEqual(expected);
    });
  });
});

let loader: HarnessLoader;

const mockedInteractive = mock(InteractiveEntity);

const consumeAction = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

const pickAction = createActionableDefinition('PICK', 'pick', 'Pick');

const expected = new ActionableEvent(consumeAction, 'id1');
