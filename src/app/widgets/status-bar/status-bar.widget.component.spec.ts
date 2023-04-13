import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBarWidgetComponent } from './status-bar.widget.component';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { fakeCharacterSheetDerivedAttributes } from '../../../../tests/fakes';
import { unarmedWeapon } from '../../definitions/weapon.definition';

describe('StatusBarWidgetComponent', () => {
  let component: StatusBarWidgetComponent;
  let fixture: ComponentFixture<StatusBarWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBarWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBarWidgetComponent);
    component = fixture.componentInstance;

    component.status = CharacterStatusView.create(
      fakeCharacterSheetDerivedAttributes,
      unarmedWeapon,
      'VISIBLE'
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
