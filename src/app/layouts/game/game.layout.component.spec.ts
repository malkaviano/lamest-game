import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GameLayoutComponent } from './game.layout.component';
import { ArrayView } from '@wrappers/array.view';
import { ActionableEvent } from '@events/actionable.event';
import { unarmedWeapon } from '@behaviors/equipment.behavior';
import { ViewableInterface } from '../../interfaces/viewable.interface';
import { SceneEntity } from '@entities/scene.entity';

import {
  actionAsk,
  fakeCharacterSheet,
  fakeCharacterStatusView,
} from '../../../../tests/fakes';
import { setupMocks } from '../../../../tests/mocks';
import { ActorEntity } from '../../../backend/entities/actor.entity';
import { createActionableDefinition } from '@definitions/actionable.definition';

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

    component.logs = ArrayView.create('OMG', 'This is not happening', 'GG');

    component.equipped = unarmedWeapon;

    component.characterStatus = fakeCharacterStatusView;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('actors panel', () => {
    it(`should have values`, () => {
      const result = fixture.debugElement.query(By.css(`app-actors-panel`));

      expect(result.properties['panelName']).toEqual('actors');

      expect(result.properties['actors']).toEqual(ArrayView.create(fakeActor));
    });

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(actionAsk, 'id1');

      const panel = fixture.debugElement.query(By.css(`app-actors-panel`));

      let result: ActionableEvent | undefined;

      component.actionSelected.asObservable().subscribe((event) => {
        result = event;
      });

      panel.triggerEventHandler('actionSelected', event);

      done();

      expect(result).toEqual(event);
    });
  });

  it(`should have action log`, () => {
    const result = fixture.debugElement.query(By.css('[data-testid="log"]'));

    expect(result).not.toBeNull();

    expect(component.logs).toEqual(
      ArrayView.create('OMG', 'This is not happening', 'GG')
    );
  });

  describe('Status Bar', () => {
    it('has character status', () => {
      expect(component.characterStatus).toEqual(fakeCharacterStatusView);
    });
  });

  describe('Scene image', () => {
    it('show scene image via global actions panel', (done) => {
      const event = {
        title: 'title',
        src: 'image.jpg',
        alt: 'alt',
        width: '400',
        height: '400',
      };

      const globalActionsPanel = fixture.debugElement.query(
        By.css(`app-global-actions-panel`)
      );

      let result: ViewableInterface | undefined;

      component.sceneOpened.asObservable().subscribe((event) => {
        result = event;
      });

      globalActionsPanel.triggerEventHandler('sceneOpened', event);

      done();

      expect(result).toEqual(event);
    });
  });
});

const mockedActor = mock(ActorEntity);

when(mockedActor.id).thenReturn('orc1');
when(mockedActor.name).thenReturn('Orc Warrior');
when(mockedActor.description).thenReturn(
  'A fierce orc warrior ready for battle'
);
when(mockedActor.classification).thenReturn('ACTOR');
when(mockedActor.behavior).thenReturn('AGGRESSIVE');
when(mockedActor.situation).thenReturn('ALIVE');
when(mockedActor.visibility).thenReturn('VISIBLE');
when(mockedActor.actions).thenReturn(
  ArrayView.create(
    createActionableDefinition('AFFECT', 'attack', 'Attack'),
    createActionableDefinition('SKILL', 'intimidation', 'Intimidation')
  )
);
when(mockedActor.actionsChanged$).thenReturn(
  of(
    ArrayView.create(
      createActionableDefinition('AFFECT', 'attack', 'Attack'),
      createActionableDefinition('SKILL', 'intimidation', 'Intimidation')
    )
  )
);
when(mockedActor.ignores).thenReturn(ArrayView.create());

const fakeActor = instance(mockedActor);

const scene = new SceneEntity(
  'scene',
  'this is a test',
  ArrayView.create(fakeActor),
  'gg.jpg'
);
