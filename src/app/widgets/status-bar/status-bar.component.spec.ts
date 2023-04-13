import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBarComponent } from './status-bar.component';
import { CharacterStatusView } from '../../model-views/character-status';
import { fakeCharacterSheetDerivedAttributes } from '../../../../tests/fakes';
import { unarmedWeapon } from '../../definitions/weapon.definition';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBarComponent);
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
