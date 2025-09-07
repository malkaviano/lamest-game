import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TacticalStatusPanelComponent } from './tactical-status.panel.component';
import { WindowWidgetComponent } from '../../widgets/window/window.widget.component';
import { MaterialModule } from '../../../material/material.module';

import { ArrayView } from '@wrappers/array.view';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';
import { GameItemDefinition } from '../../../backend/conceptual/definitions/game-item.definition';
import { ItemIdentityDefinition } from '../../../backend/conceptual/definitions/item-identity.definition';
import { ActionableEvent } from '@events/actionable.event';
import {
  stripActionable,
  unequipActionable,
} from '@definitions/actionable.definition';

class TestItem extends GameItemDefinition {
  constructor(name: string, label: string = name) {
    super(
      'WEAPON',
      new ItemIdentityDefinition(name, label, label),
      'PERMANENT'
    );
  }
}

const makeStatus = (
  options?: Partial<{
    weaponName: string;
    armorName: string;
    visibility: 'VISIBLE' | 'HIDDEN' | 'DISGUISED';
    derived: KeyValueDescriptionView[];
  }>
): CharacterStatusView => {
  const weapon = new TestItem(options?.weaponName ?? 'sword', 'Sword');
  const armor = new TestItem(
    options?.armorName ?? 'leatherArmor',
    'Leather Armor'
  );
  const visibility = KeyValueDescriptionView.create(
    'visibility',
    options?.visibility ?? 'VISIBLE',
    'visibility',
    'unknown'
  );
  return CharacterStatusView.create(
    'player-1',
    ArrayView.fromArray(
      options?.derived ?? [
        KeyValueDescriptionView.create(
          'HP',
          '10',
          'Health',
          'derived-attribute'
        ),
        KeyValueDescriptionView.create(
          'EP',
          '5',
          'Energy',
          'derived-attribute'
        ),
        KeyValueDescriptionView.create(
          'AP',
          '2',
          'Action',
          'derived-attribute'
        ),
      ]
    ),
    weapon,
    armor,
    visibility
  );
};

describe('TacticalStatusPanelComponent', () => {
  let component: TacticalStatusPanelComponent;
  let fixture: ComponentFixture<TacticalStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TacticalStatusPanelComponent, WindowWidgetComponent],
      imports: [MaterialModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TacticalStatusPanelComponent);
    component = fixture.componentInstance;
    component.status = makeStatus();
    component.sceneLabel = 'Dungeon';
    fixture.detectChanges();
  });

  it('should create and render scene title', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dungeon');
  });

  it('toggles collapse state via button', () => {
    const content = () =>
      fixture.debugElement.query(By.css('.tactical-content'));
    expect(component.isCollapsed).toBeFalse();
    expect(content().nativeElement.classList).not.toContain('collapsed');

    const toggle = fixture.debugElement.query(By.css('.collapse-toggle'));
    toggle.nativeElement.click();
    fixture.detectChanges();

    expect(component.isCollapsed).toBeTrue();
    expect(content().nativeElement.classList).toContain('collapsed');
  });

  it('renders a window widget per derived attribute', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-window-widget'));
    expect(cards.length).toBe(3);
  });

  it('shows/hides unequip buttons based on default equipment', () => {
    // Default names are not special, both should be visible
    let buttons = fixture.debugElement.queryAll(By.css('.unequip-button'));
    expect(buttons.length).toBe(2);

    // Hide weapon unequip when unarmed
    component.status = makeStatus({ weaponName: 'unarmedWeapon' });
    fixture.detectChanges();
    buttons = fixture.debugElement.queryAll(By.css('.unequip-button'));
    expect(buttons.length).toBe(1); // Only armor button remains

    // Hide armor strip when clothArmor
    component.status = makeStatus({ armorName: 'clothArmor' });
    fixture.detectChanges();
    buttons = fixture.debugElement.queryAll(By.css('.unequip-button'));
    expect(buttons.length).toBe(1); // Only weapon button remains
  });

  it('emits action for unequip weapon', () => {
    const emitted: ActionableEvent[] = [];
    component.actionSelected.subscribe((e) => emitted.push(e));

    const buttons = fixture.debugElement.queryAll(By.css('.unequip-button'));
    const weaponBtn = buttons[0].nativeElement as HTMLButtonElement;
    weaponBtn.click();

    expect(emitted.length).toBe(1);
    const ev = emitted[0];
    expect(ev.actionableDefinition.equals(unequipActionable)).toBeTrue();
    expect(ev.eventId).toBe('sword');
  });

  it('emits action for strip armor', () => {
    const emitted: ActionableEvent[] = [];
    component.actionSelected.subscribe((e) => emitted.push(e));

    const buttons = fixture.debugElement.queryAll(By.css('.unequip-button'));
    const armorBtn = buttons[1].nativeElement as HTMLButtonElement;
    armorBtn.click();

    expect(emitted.length).toBe(1);
    const ev = emitted[0];
    expect(ev.actionableDefinition.equals(stripActionable)).toBeTrue();
    expect(ev.eventId).toBe('leatherArmor');
  });

  it('shows visibility text according to status', () => {
    const getText = () =>
      (fixture.nativeElement as HTMLElement)
        .querySelector('.visibility-text')!
        .textContent!.trim();

    component.status = makeStatus({ visibility: 'VISIBLE' });
    fixture.detectChanges();
    expect(getText()).toBe('Visible');

    component.status = makeStatus({ visibility: 'HIDDEN' });
    fixture.detectChanges();
    expect(getText()).toBe('Hidden');

    component.status = makeStatus({ visibility: 'DISGUISED' });
    fixture.detectChanges();
    expect(getText()).toBe('Disguised');
  });
});
