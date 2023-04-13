import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ArrayView } from '../../view-models/array.view';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { GameLayoutComponent } from './game.layout.component';
import { ActionableItemView } from '../../view-models/actionable-item.view';
import { ActionableEvent } from '../../events/actionable.event';
import { unarmedWeapon } from '../../definitions/weapon.definition';
import { CharacterStatusView } from '../../view-models/character-status.view';

import {
  actionAsk,
  fakeCharacterSheet,
  fakeCharacterSheetDerivedAttributes,
  molotov,
  simpleSword,
} from '../../../../tests/fakes';
import { setupMocks } from '../../../../tests/mocks';

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

    component.ngOnChanges();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it(`should have image`, () => {
    const result = fixture.debugElement.query(By.css('[data-testid="image"]'));

    expect(result).not.toBeNull();
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

    describe('when status change', () => {
      it('updates the status', () => {
        component.equipped = simpleSword;

        component.ngOnChanges();

        fixture.detectChanges();

        expect(component.characterStatus).toEqual(fakeCharacterStatusChanged);
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
  'this is a test',
  ArrayView.create([fakeInteractive]),
  'gg.jpg'
);

const fakeCharacterStatus = CharacterStatusView.create(
  fakeCharacterSheetDerivedAttributes,
  unarmedWeapon,
  'VISIBLE'
);

const fakeCharacterStatusChanged = CharacterStatusView.create(
  fakeCharacterSheetDerivedAttributes,
  simpleSword,
  'VISIBLE'
);
