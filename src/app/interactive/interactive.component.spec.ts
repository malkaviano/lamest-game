import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { InteractiveComponent } from './interactive.component';
import { Interactive } from '../definitions/interactive.definition';
import { MaterialModule } from '../../material/material.module';
import { ActionSelection } from '../definitions/action-selection.definition';
import { first } from 'rxjs';
import { SelectedAction } from '../definitions/selected-action.definition';

let loader: HarnessLoader;

describe('InteractiveComponent', () => {
  let component: InteractiveComponent;
  let fixture: ComponentFixture<InteractiveComponent>;

  const interactive = new Interactive(
    'aid1',
    'Action1',
    'Simple action to be performed',
    'This is the long description about the actionable',
    [
      new ActionSelection('id1', 'Do it'),
      new ActionSelection('id2', "Don't do it"),
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

  it('should render title', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getTitleText()).toEqual('Action1');
  });

  it('should render brief description', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getSubtitleText()).toEqual(
      'Simple action to be performed'
    );
  });

  it('should render long description', async () => {
    const card = await loader.getHarness(MatCardHarness);

    expect(await card.getText()).toContain(
      'This is the long description about the actionable'
    );
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

      let result: SelectedAction | undefined;
      const expected = new SelectedAction('id1', 'aid1');

      fixture.componentInstance.onActionSelected
        .pipe(first())
        .subscribe((action: SelectedAction) => (result = action));

      await button.click();

      expect(result).toEqual(expected);
    });
  });
});
