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
import { ActionableEvent } from '../../events/actionable.event';
import { unarmedWeapon } from '../../definitions/weapon.definition';

import {
  actionAsk,
  fakeCharacterSheet,
  fakeCharacterStatusView,
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

    component.equipped = unarmedWeapon;

    component.characterStatus = fakeCharacterStatusView;

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
    it('has character status', () => {
      expect(component.characterStatus).toEqual(fakeCharacterStatusView);
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
