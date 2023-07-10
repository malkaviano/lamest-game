import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SheetPanelComponent } from './sheet.panel.component';
import { ActionableItemView } from '@core/view-models/actionable-item.view';
import { ActionableEvent } from '@core/events/actionable.event';

import {
  actionAsk,
  fakeCharacterSheet,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetIdentity,
  fakeCharacterSheetSkills,
  molotov,
  simpleSword,
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

    component.inventory = [
      ActionableItemView.create(simpleSword, actionAsk),
      ActionableItemView.create(molotov, actionAsk),
    ];

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

  describe('inventory panel', () => {
    it(`should have items`, () => {
      const result = fixture.debugElement
        .query(By.css('[data-testid="inventory"]'))
        .queryAll(By.css('app-equipment-widget'));

      expect(result.length).toEqual(2);
    });

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(actionAsk, 'id1');

      const panel = fixture.debugElement
        .query(By.css('[data-testid="inventory"]'))
        .query(By.css('app-equipment-widget'));

      let result: ActionableEvent | undefined;

      component.actionSelected.asObservable().subscribe((event) => {
        result = event;

        done();
      });

      panel.triggerEventHandler('actionSelected', event);

      expect(result).toEqual(event);
    });
  });
});
