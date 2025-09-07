import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MaterialModule } from '../../../material/material.module';
import { GlobalActionsPanelComponent } from './global-actions.panel.component';
import { ActionWidgetComponent } from '../../widgets/action/action.widget.component';

import { ArrayView } from '@wrappers/array.view';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';
import { SceneEntity } from '../../../backend/entities/scene.entity';
import { GameItemDefinition } from '../../../backend/conceptual/definitions/game-item.definition';
import { ItemIdentityDefinition } from '../../../backend/conceptual/definitions/item-identity.definition';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { HarnessLoader } from '@angular/cdk/testing';
import { ActionableEvent } from '../../../backend/events/actionable.event';
import { ViewableInterface } from '../../interfaces/viewable.interface';

class TestItem extends GameItemDefinition {
  constructor() {
    super(
      'WEAPON',
      new ItemIdentityDefinition('test', 'Test', 'Test item'),
      'PERMANENT'
    );
  }
}

describe('GlobalActionsPanelComponent', () => {
  let component: GlobalActionsPanelComponent;
  let fixture: ComponentFixture<GlobalActionsPanelComponent>;
  let loader: HarnessLoader;

  const createStatus = (
    visible: 'VISIBLE' | 'HIDDEN' = 'VISIBLE'
  ): CharacterStatusView => {
    const visibility = KeyValueDescriptionView.create(
      'visibility',
      visible,
      'visibility',
      'unknown'
    );
    return CharacterStatusView.create(
      'player-1',
      ArrayView.empty(),
      new TestItem(),
      new TestItem(),
      visibility
    );
  };

  const createScene = (): SceneEntity =>
    new SceneEntity('forest', 'Forest', ArrayView.empty(), 'forest.png');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalActionsPanelComponent, ActionWidgetComponent],
      imports: [MaterialModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalActionsPanelComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.status = createStatus('VISIBLE');
    component.scene = createScene();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Global Actions');
  });

  it('toggles collapse when clicking the header button', () => {
    const toggle = fixture.debugElement.query(By.css('.collapse-toggle'));
    const content = () =>
      fixture.debugElement.query(By.css('.actions-content'));

    expect(component.isCollapsed).toBeFalse();
    expect(content().nativeElement.classList).not.toContain('collapsed');

    toggle.nativeElement.click();
    fixture.detectChanges();

    expect(component.isCollapsed).toBeTrue();
    expect(content().nativeElement.classList).toContain('collapsed');
  });

  it('emits playerOptions when toggling Auto Dodge', async () => {
    const checkbox = await loader.getHarness(MatCheckboxHarness);

    const emitted: {
      readonly dodge?: boolean | undefined;
      readonly visible?: boolean | undefined;
    }[] = [];

    component.playerOptions.subscribe((e) => emitted.push(e));

    await checkbox.check();
    expect(emitted.pop()).toEqual({ dodge: true });

    await checkbox.uncheck();
    expect(emitted.pop()).toEqual({ dodge: false });
  });

  it('emits actionSelected for Hide when visible', () => {
    // Ensure visible state
    component.status = createStatus('VISIBLE');
    fixture.detectChanges();

    const emitted: ActionableEvent[] = [];
    component.actionSelected.subscribe((e) => emitted.push(e));

    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      'button[data-testid="action-Hide"]'
    );
    expect(btn).toBeTruthy();
    btn!.click();

    expect(emitted.length).toBe(1);
    const ev = emitted[0];
    expect(
      ev.actionableDefinition.equals(
        createActionableDefinition('SKILL', 'Hide', 'Hide')
      )
    ).toBeTrue();
    expect(ev.eventId).toBe('player-1');
  });

  it('shows Become Visible when hidden and emits visible option when clicked', () => {
    component.status = createStatus('HIDDEN');
    fixture.detectChanges();

    const emitted: {
      readonly dodge?: boolean | undefined;
      readonly visible?: boolean | undefined;
    }[] = [];

    component.playerOptions.subscribe((e) => emitted.push(e));

    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      'button[data-testid="action-Become Visible"]'
    );
    expect(btn).toBeTruthy();
    btn!.click();

    expect(emitted).toContain({ visible: true });
  });

  it('emits actionSelected for Detect', () => {
    const emitted: ActionableEvent[] = [];
    component.actionSelected.subscribe((e) => emitted.push(e));

    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      'button[data-testid="action-Detect"]'
    );
    expect(btn).toBeTruthy();
    btn!.click();

    expect(emitted.length).toBe(1);
    const ev = emitted[0];
    expect(
      ev.actionableDefinition.equals(
        createActionableDefinition('SKILL', 'Detect', 'Detect')
      )
    ).toBeTrue();
    expect(ev.eventId).toBe('player-1');
  });

  it('emits sceneOpened with computed scene image when clicking scene button', () => {
    const emitted: ViewableInterface[] = [];
    component.sceneOpened.subscribe((e) => emitted.push(e));

    const btn: HTMLButtonElement = fixture.debugElement.query(
      By.css('.scene-button')
    ).nativeElement;
    btn.click();

    expect(emitted.length).toBe(1);
    const view = emitted[0];
    expect(view.title).toBe('Forest');
    expect(view.alt).toBe('Forest');
    expect(view.src).toBe('assets/images/forest.png');
    expect(view.width).toBe('400');
    expect(view.height).toBe('400');
  });
});
