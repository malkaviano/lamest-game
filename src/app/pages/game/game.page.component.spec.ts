import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePageComponent } from './game.page.component';
import { ArrayView } from '../../views/array.view';
import { PlayerEntity } from '../../entities/player.entity';
import { IdentityDefinition } from '../../definitions/identity.definition';
import { CharacteristicDefinition } from '../../definitions/characteristic.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { GameBridgeService } from '../../services/game-bridge.service';
import { GameEventsDefinition } from '../../definitions/game-events.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../../definitions/actionable.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { WeaponDefinition } from '../../definitions/weapon.definition';
import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { DamageDefinition } from '../../definitions/damage.definition';
import { createDice } from '../../definitions/dice.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { createTookLogMessage } from '../../definitions/log-message.definition';
import { DerivedAttributeDefinition } from '../../definitions/derived-attribute.definition';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { ConverterHelper } from '../../helpers/converter.helper';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';

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
          useValue: instance(mockedGameManagerService),
        },
        {
          provide: WithSubscriptionHelper,
          useValue: instance(mockedWithSubscriptionHelper),
        },
        {
          provide: ConverterHelper,
          useValue: instance(mockedConverterHelper),
        },
      ],
    }).compileComponents();

    when(mockedGameManagerService.events).thenReturn(
      instance(mockedGameEventsService)
    );

    when(mockedGameEventsService.characterChanged$).thenReturn(
      of(instance(mockedPlayerEntity))
    );

    when(mockedGameEventsService.sceneChanged$).thenReturn(of(scene));

    when(mockedGameEventsService.playerInventory$).thenReturn(
      of(
        new ArrayView([
          new ActionableItemDefinition(weapon1, askAction),
          new ActionableItemDefinition(weapon2, askAction),
        ])
      )
    );

    when(mockedGameEventsService.actionLogged$).thenReturn(of(log));

    when(mockedPlayerEntity.characteristics).thenReturn({
      STR: new CharacteristicDefinition('STR', 8),
      CON: new CharacteristicDefinition('CON', 9),
      SIZ: new CharacteristicDefinition('SIZ', 10),
      DEX: new CharacteristicDefinition('DEX', 11),
      INT: new CharacteristicDefinition('INT', 12),
      POW: new CharacteristicDefinition('POW', 13),
      APP: new CharacteristicDefinition('APP', 14),
    });

    when(mockedPlayerEntity.identity).thenReturn(
      new IdentityDefinition(
        'name',
        'Hunter',
        'ADULT',
        'HUMAN',
        'AVERAGE',
        'AVERAGE'
      )
    );

    when(mockedPlayerEntity.derivedAttributes).thenReturn({
      HP: new DerivedAttributeDefinition('HP', 9),
      PP: new DerivedAttributeDefinition('PP', 13),
      MOV: new DerivedAttributeDefinition('MOV', 10),
    });

    when(
      mockedConverterHelper.characterToKeyValueDescription(
        instance(mockedPlayerEntity)
      )
    ).thenReturn(
      new CharacterValuesDefinition(
        identityValues,
        characteristicValues,
        derivedAttributeValues,
        skillValues
      )
    );

    fixture = TestBed.createComponent(GamePageComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have identity values`, () => {
    expect(component.characterValues.identity).toEqual(identityValues);
  });

  it(`should have characteristic values`, () => {
    expect(component.characterValues.characteristics).toEqual(
      characteristicValues
    );
  });

  it(`should have derived attributes values`, () => {
    expect(component.characterValues.derivedAttributes).toEqual(
      derivedAttributeValues
    );
  });

  it(`should have skills values`, () => {
    expect(component.characterValues.skills).toEqual(skillValues);
  });

  it(`should have description`, () => {
    expect(component.scene.description).toEqual(
      new ArrayView(['this is a test', 'okay okay'])
    );
  });

  it(`should have interactives`, () => {
    expect(component.scene.interactives).toEqual(
      new ArrayView([
        new InteractiveEntity(
          'id1',
          'props1',
          'This is props1',
          new SimpleState(new ArrayView([askAction]))
        ),
      ])
    );
  });

  it(`should have action log`, () => {
    expect(component.logs).toEqual(new ArrayView([log.toString()]));
  });

  it(`should have inventory`, () => {
    expect(component.inventory).toEqual([
      new ActionableItemDefinition(
        new WeaponDefinition(
          'sword1',
          'Rusted Sword',
          'Old sword full of rust',
          'Melee Weapon (Simple)',
          new DamageDefinition(
            { D4: 0, D6: 1, D8: 0, D10: 0, D12: 0, D20: 0, D100: 0 },
            0
          ),
          true,
          'PERMANENT'
        ),
        new ActionableDefinition('ASK', 'action1', 'Got action?')
      ),
      new ActionableItemDefinition(
        new WeaponDefinition(
          'sword2',
          'Decent Sword',
          'A good sword, not exceptional',
          'Melee Weapon (Simple)',
          new DamageDefinition(
            { D4: 0, D6: 1, D8: 0, D10: 0, D12: 0, D20: 0, D100: 0 },
            0
          ),
          true,
          'PERMANENT'
        ),
        new ActionableDefinition('ASK', 'action1', 'Got action?')
      ),
    ]);
  });

  describe('actionSelected', () => {
    it('should send an ActionableEvent', () => {
      const event = new ActionableEvent(askAction, 'id1');

      const spy = spyOn(
        instance(mockedGameManagerService),
        'actionableReceived'
      );

      component.informActionSelected(event);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const mockedPlayerEntity = mock(PlayerEntity);

const askAction = createActionableDefinition('ASK', 'action1', 'Got action?');

const scene = new SceneDefinition(
  new ArrayView(['this is a test', 'okay okay']),
  new ArrayView([
    new InteractiveEntity(
      'id1',
      'props1',
      'This is props1',
      new SimpleState(new ArrayView([askAction]))
    ),
  ])
);

const mockedGameManagerService = mock(GameBridgeService);

const mockedGameEventsService = mock(GameEventsDefinition);

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Decent Sword',
  'A good sword, not exceptional',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

const log = createTookLogMessage('player', 'test', 'Sword');

const mockedWithSubscriptionHelper = mock(WithSubscriptionHelper);

const mockedConverterHelper = mock(ConverterHelper);

const identityValues = new ArrayView([
  new KeyValueDescriptionDefinition('NAME', 'name', 'Character name'),
  new KeyValueDescriptionDefinition(
    'PROFESSION',
    'Hunter',
    'Character profession'
  ),
  new KeyValueDescriptionDefinition('AGE', 'ADULT', 'Character age'),
  new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
  new KeyValueDescriptionDefinition('HEIGHT', 'AVERAGE', 'Character height'),
  new KeyValueDescriptionDefinition('WEIGHT', 'AVERAGE', 'Character weight'),
]);

const characteristicValues = new ArrayView([
  new KeyValueDescriptionDefinition('STR', '8', 'The character physical force'),
  new KeyValueDescriptionDefinition(
    'CON',
    '9',
    'The character body constitution'
  ),
  new KeyValueDescriptionDefinition('SIZ', '10', 'The character body shape'),
  new KeyValueDescriptionDefinition('DEX', '11', 'The character agility'),
  new KeyValueDescriptionDefinition('INT', '12', 'The character intelligence'),
  new KeyValueDescriptionDefinition(
    'POW',
    '13',
    'The character mental strength'
  ),
  new KeyValueDescriptionDefinition('APP', '14', 'The character looks'),
]);

const derivedAttributeValues = new ArrayView([
  new KeyValueDescriptionDefinition('HP', '9', 'The character hit points'),
  new KeyValueDescriptionDefinition('PP', '13', 'The character power points'),
  new KeyValueDescriptionDefinition('MOV', '10', 'The character movement'),
]);

const skillValues = new ArrayView([
  new KeyValueDescriptionDefinition('Appraise', '12', ''),
  new KeyValueDescriptionDefinition(
    'Dodge',
    '32',
    'Ability to avoid being hit'
  ),
]);
