import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePageComponent } from './game.page.component';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ArrayView } from '@wrappers/array.view';
import { ActionableEvent } from '@events/actionable.event';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameLoopService } from '@services/game-loop.service';
import {
  consumeActionable,
  equipActionable,
} from '@definitions/actionable.definition';

import {
  mockedFormatterHelperService,
  mockedGameEventsValues,
  mockedGameLoopService,
  mockedInteractiveEntity,
  mockedWithSubscriptionHelper,
  setupMocks,
} from '../../../../tests/mocks';
import {
  actionableItemView,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetIdentity,
  fakeCharacterSheetSkills,
  readable,
  simpleSword,
  unDodgeableAxe,
} from '../../../../tests/fakes';

describe('GamePageComponent', () => {
  const mockedMatDialog = mock(MatDialog);

  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [GamePageComponent],
      // Unit Test page, child won't be rendered
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GameLoopService,
          useValue: instance(mockedGameLoopService),
        },
        {
          provide: WithSubscriptionHelper,
          useValue: instance(mockedWithSubscriptionHelper),
        },
        {
          provide: FormatterHelperService,
          useValue: instance(mockedFormatterHelperService),
        },
        {
          provide: MatDialog,
          useValue: instance(mockedMatDialog),
        },
      ],
    }).compileComponents();

    setupMocks();

    when(mockedGameEventsValues.playerInventory$).thenReturn(
      of(
        ArrayView.create(
          new ActionableItemDefinition(simpleSword, equipActionable),
          new ActionableItemDefinition(unDodgeableAxe, equipActionable)
        )
      )
    );

    when(mockedGameEventsValues.actionLogged$).thenReturn(of(log));

    when(mockedGameEventsValues.documentOpened$).thenReturn(of(readable));

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
    expect(component.scene.label).toEqual('this is a test');
  });

  it(`should have interactives`, () => {
    expect(component.scene.interactives).toEqual(
      ArrayView.create(instance(mockedInteractiveEntity))
    );
  });

  it(`should have action log`, () => {
    expect(component.logs).toEqual(ArrayView.create('player: Sword'));
  });

  it(`should have inventory`, () => {
    expect(component.inventory).toEqual([
      actionableItemView(simpleSword, equipActionable),
      actionableItemView(unDodgeableAxe, equipActionable),
    ]);
  });

  describe('actionSelected', () => {
    it('should send an ActionableEvent', () => {
      const event = new ActionableEvent(consumeActionable, 'id1');

      const spy = spyOn(instance(mockedGameLoopService), 'actionableReceived');

      component.informActionSelected(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const log = new LogMessageDefinition('AFFECTED', 'player', 'Sword');
