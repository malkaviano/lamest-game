import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { instance, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePageComponent } from './game.page.component';
import { GameLoopService } from '../../services/game-loop.service';
import { ActionableItemView } from '../../../core/view-models/actionable-item.view';
import { ArrayView } from '../../../core/view-models/array.view';
import { ActionableEvent } from '../../../core/events/actionable.event';
import { LogMessageDefinition } from '../../../core/definitions/log-message.definition';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

import {
  mockedFormatterHelperService,
  mockedGameEventsService,
  mockedGameLoopService,
  mockedInteractiveEntity,
  mockedMatDialog,
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

describe('GamePageComponent', () => {
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

    when(mockedGameEventsService.playerInventory$).thenReturn(
      of(
        ArrayView.create([
          ActionableItemView.create(simpleSword, actionEquip),
          ActionableItemView.create(unDodgeableAxe, actionEquip),
        ])
      )
    );

    when(mockedGameEventsService.actionLogged$).thenReturn(of(log));

    when(mockedGameEventsService.documentOpened$).thenReturn(
      of({
        title: 'GG',
        text: ArrayView.create([]),
      })
    );

    when(mockedGameEventsService.canActChanged$).thenReturn(of(true));

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
    expect(component.scene.description).toEqual('this is a test');
  });

  it(`should have interactives`, () => {
    expect(component.scene.interactives).toEqual(
      ArrayView.create([instance(mockedInteractiveEntity)])
    );
  });

  it(`should have action log`, () => {
    expect(component.logs).toEqual(ArrayView.create(['player: Sword']));
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

      const spy = spyOn(instance(mockedGameLoopService), 'actionableReceived');

      component.informActionSelected(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const log = new LogMessageDefinition('AFFECTED', 'player', 'Sword');
