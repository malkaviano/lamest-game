import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SheetPanelComponent } from './sheet.panel.component';
import {
  fakeCharacterSheet,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetIdentity,
  fakeCharacterSheetSkills,
} from '../../../../tests/fakes';

describe('SheetPanelComponent', () => {
  let component: SheetPanelComponent;
  let fixture: ComponentFixture<SheetPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetPanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetPanelComponent);

    component = fixture.componentInstance;

    component.characterValues = fakeCharacterSheet;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have identity values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="identity"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('identity');

    expect(result.properties['items']).toEqual(fakeCharacterSheetIdentity);
  });

  it(`should have characteristic values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="characteristics"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('characteristics');

    expect(result.properties['items']).toEqual(
      fakeCharacterSheetCharacteristics
    );
  });

  it(`should have derived attributes values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="derived-attributes"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('derived-attributes');

    expect(result.properties['items']).toEqual(
      fakeCharacterSheetDerivedAttributes
    );
  });

  it(`should have skills values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="skills"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('skills');

    expect(result.properties['items']).toEqual(fakeCharacterSheetSkills);
  });
});
