import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { instance, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePageComponent } from './game.page.component';
import { ArrayView } from '../../views/array.view';
import { GameBridgeService } from '../../services/game-bridge.service';
import { ActionableEvent } from '../../events/actionable.event';
import { ActionableItemView } from '../../views/actionable-item.view';
import { createTookLogMessage } from '../../definitions/log-message.definition';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

import {
  mockedFormatterHelperService,
  mockedGameBridgeService,
  mockedGameEventsService,
  mockedInteractiveEntity,
  mockedWithSubscriptionHelper,
  setupMocks,
} from '../../../../tests/mocks';
import {
  actionableItemView,
  actionConsume,
  actionEquip,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetIdentity,
  fakeCharacterSheetSkills,
  simpleSword,
  unDodgeableAxe,
} from '../../../../tests/fakes';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      declarations: [GamePageComponent],
      // Unit Test page, child won't be rendered
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GameBridgeService,
          useValue: instance(mockedGameBridgeService),
        },
        {
          provide: WithSubscriptionHelper,
          useValue: instance(mockedWithSubscriptionHelper),
        },
        {
          provide: FormatterHelperService,
          useValue: instance(mockedFormatterHelperService),
        },
      ],
    }).compileComponents();

    setupMocks();

    when(mockedGameEventsService.playerInventory$).thenReturn(
      of(
        ArrayView.create([
          new ActionableItemView(simpleSword, actionEquip),
          new ActionableItemView(unDodgeableAxe, actionEquip),
        ])
      )
    );

    when(mockedGameEventsService.actionLogged$).thenReturn(of(log));

    fixture = TestBed.createComponent(GamePageComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have identity values`, () => {
    expect(component.characterValues.identity).toEqual(
      fakeCharacterSheetIdentity
    );
  });

  it(`should have characteristic values`, () => {
    expect(component.characterValues.characteristics).toEqual(
      fakeCharacterSheetCharacteristics
    );
  });

  it(`should have derived attributes values`, () => {
    expect(component.characterValues.derivedAttributes).toEqual(
      fakeCharacterSheetDerivedAttributes
    );
  });

  it(`should have skills values`, () => {
    expect(component.characterValues.skills).toEqual(fakeCharacterSheetSkills);
  });

  it(`should have description`, () => {
    expect(component.scene.description).toEqual(
      ArrayView.create(['this is a test', 'okay okay'])
    );
  });

  it(`should have interactives`, () => {
    expect(component.scene.interactives).toEqual(
      ArrayView.create([instance(mockedInteractiveEntity)])
    );
  });

  it(`should have action log`, () => {
    expect(component.logs).toEqual(ArrayView.create([log.toString()]));
  });

  it(`should have inventory`, () => {
    expect(component.inventory).toEqual([
      actionableItemView(simpleSword, actionEquip),
      actionableItemView(unDodgeableAxe, actionEquip),
    ]);
  });

  describe('actionSelected', () => {
    it('should send an ActionableEvent', () => {
      const event = new ActionableEvent(actionConsume, 'id1');

      const spy = spyOn(
        instance(mockedGameBridgeService),
        'actionableReceived'
      );

      component.informActionSelected(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const log = createTookLogMessage('player', 'test', 'Sword');
