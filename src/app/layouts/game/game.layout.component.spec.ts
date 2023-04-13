import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ArrayView } from '../../model-views/array.view';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { GameLayoutComponent } from './game.layout.component';
import { ActionableItemView } from '../../model-views/actionable-item.view';
import { ActionableEvent } from '../../events/actionable.event';
import { unarmedWeapon } from '../../definitions/weapon.definition';

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
import { setupMocks } from '../../../../tests/mocks';
import { CharacterStatusView } from '../../model-views/character-status';

describe('GameLayoutComponent', () => {
  let component: GameLayoutComponent;
  let fixture: ComponentFixture<GameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      declarations: [GameLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    setupMocks();

    fixture = TestBed.createComponent(GameLayoutComponent);

    component = fixture.componentInstance;

    component.characterValues = fakeCharacterSheet;

    component.scene = scene;

    component.logs = ArrayView.create(['OMG', 'This is not happening', 'GG']);

    component.inventory = [
      ActionableItemView.create(simpleSword, actionAsk),
      ActionableItemView.create(molotov, actionAsk),
    ];

    component.equipped = unarmedWeapon;

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
      .query(By.css(`[data-testid="character"]`))
      .query(By.css(`[data-testid="skills"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('skills');

    expect(result.properties['items']).toEqual(fakeCharacterSheetSkills);
  });

  describe('interactives panel', () => {
    it(`should have values`, () => {
      const result = fixture.debugElement.query(
        By.css(`app-interactive-panel`)
      );

      expect(result.properties['panelName']).toEqual('interactives');

      expect(result.properties['interactives']).toEqual(
        ArrayView.create([fakeInteractive])
      );
    });

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(actionAsk, 'id1');

      const panel = fixture.debugElement.query(By.css(`app-interactive-panel`));

      let result: ActionableEvent | undefined;

      component.actionSelected.asObservable().subscribe((event) => {
        result = event;
      });

      panel.triggerEventHandler('actionSelected', event);

      done();

      expect(result).toEqual(event);
    });
  });

  describe('inventory panel', () => {
    it(`should have items`, () => {
      const result = fixture.debugElement.query(By.css('app-inventory-panel'));

      expect(result.properties['panelName']).toEqual('inventory');

      expect(result.properties['inventory']).toEqual([
        ActionableItemView.create(simpleSword, actionAsk),
        ActionableItemView.create(molotov, actionAsk),
      ]);

      expect(result.properties['equipped']).toEqual(unarmedWeapon);
    });

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(actionAsk, 'id1');

      const panel = fixture.debugElement.query(By.css(`app-inventory-panel`));

      let result: ActionableEvent | undefined;

      component.actionSelected.asObservable().subscribe((event) => {
        result = event;
      });

      panel.triggerEventHandler('actionSelected', event);

      done();

      expect(result).toEqual(event);
    });
  });

  it(`should have description`, () => {
    const result = fixture.debugElement.query(
      By.css('[data-testid="description"]')
    );
    expect(result).not.toBeNull();

    expect(component.scene.description.items.length).toEqual(2);
  });

  it(`should have action log`, () => {
    const result = fixture.debugElement.query(By.css('[data-testid="log"]'));

    expect(result).not.toBeNull();

    expect(component.logs).toEqual(
      ArrayView.create(['OMG', 'This is not happening', 'GG'])
    );
  });

  describe('Status Bar', () => {
    describe('when initialized', () => {
      it('has character status', () => {
        expect(component.characterStatus).toEqual(fakeCharacterStatus);
      });
    });
  });
});

const fakeInteractive = new InteractiveEntity(
  'id1',
  'props1',
  'This is props1',
  new SimpleState(ArrayView.create([actionAsk])),
  true
);

const scene = new SceneDefinition(
  ArrayView.create(['this is a test', 'okay okay']),
  ArrayView.create([fakeInteractive])
);

const fakeCharacterStatus = CharacterStatusView.create(
  fakeCharacterSheetDerivedAttributes,
  unarmedWeapon,
  'VISIBLE'
);
