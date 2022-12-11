import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ArrayView } from '../../views/array.view';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import {
  unarmedWeapon,
  WeaponDefinition,
} from '../../definitions/weapon.definition';
import { DamageDefinition } from '../../definitions/damage.definition';
import { createDice } from '../../definitions/dice.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { GameLayoutComponent } from './game.layout.component';
import { CharacterValuesDefinition } from '../../definitions/character-values.definition';
import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';
import { ActionableEvent } from '../../events/actionable.event';

describe('GameLayoutComponent', () => {
  let component: GameLayoutComponent;
  let fixture: ComponentFixture<GameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      declarations: [GameLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLayoutComponent);

    component = fixture.componentInstance;

    component.characterValues = characterValue;

    component.scene = scene;

    component.logs = new ArrayView(['OMG', 'This is not happening', 'GG']);

    component.inventory = [
      new ActionableItemDefinition(weapon1, askAction),
      new ActionableItemDefinition(weapon2, askAction),
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

    expect(result.properties['items']).toEqual(
      new ArrayView([
        new KeyValueDescriptionDefinition('NAME', 'name', 'Character name'),
        new KeyValueDescriptionDefinition(
          'PROFESSION',
          'Hunter',
          'Character profession'
        ),
        new KeyValueDescriptionDefinition('AGE', 'ADULT', 'Character age'),
        new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
        new KeyValueDescriptionDefinition(
          'HEIGHT',
          'AVERAGE',
          'Character height'
        ),
        new KeyValueDescriptionDefinition(
          'WEIGHT',
          'AVERAGE',
          'Character weight'
        ),
      ])
    );
  });

  it(`should have characteristic values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="characteristics"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('characteristics');

    expect(result.properties['items']).toEqual(
      new ArrayView([
        new KeyValueDescriptionDefinition(
          'STR',
          '8',
          'The character physical force'
        ),
        new KeyValueDescriptionDefinition(
          'VIT',
          '9',
          'The character body constitution'
        ),
        new KeyValueDescriptionDefinition(
          'SIZ',
          '10',
          'The character body shape'
        ),
        new KeyValueDescriptionDefinition('AGI', '11', 'The character agility'),
        new KeyValueDescriptionDefinition(
          'INT',
          '12',
          'The character intelligence'
        ),
        new KeyValueDescriptionDefinition(
          'POW',
          '13',
          'The character mental strength'
        ),
        new KeyValueDescriptionDefinition('APP', '14', 'The character looks'),
      ])
    );
  });

  it(`should have derived attributes values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="derived-attributes"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('derived-attributes');

    expect(result.properties['items']).toEqual(
      new ArrayView([
        new KeyValueDescriptionDefinition(
          'HP',
          '9',
          'The character hit points'
        ),
        new KeyValueDescriptionDefinition(
          'PP',
          '13',
          'The character power points'
        ),
        new KeyValueDescriptionDefinition(
          'MOV',
          '10',
          'The character movement'
        ),
      ])
    );
  });

  it(`should have skills values panel`, () => {
    const result = fixture.debugElement
      .query(By.css(`[data-testid="character"]`))
      .query(By.css(`[data-testid="skills"]`))
      .query(By.css(`app-key-value-description-panel`));

    expect(result.properties['panelName']).toEqual('skills');

    expect(result.properties['items']).toEqual(
      new ArrayView([
        new KeyValueDescriptionDefinition('Appraise', '12', ''),
        new KeyValueDescriptionDefinition(
          'Dodge',
          '32',
          'Ability to avoid being hit'
        ),
      ])
    );
  });

  describe('interactives panel', () => {
    it(`should have values`, () => {
      const result = fixture.debugElement.query(
        By.css(`app-interactive-panel`)
      );

      expect(result.properties['panelName']).toEqual('interactives');

      expect(result.properties['interactives']).toEqual(
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

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(askAction, 'id1');

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
        new ActionableItemDefinition(weapon1, askAction),
        new ActionableItemDefinition(weapon2, askAction),
      ]);

      expect(result.properties['equipped']).toEqual(unarmedWeapon);
    });

    it('should send an ActionableEvent', (done) => {
      const event = new ActionableEvent(askAction, 'id1');

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
      new ArrayView(['OMG', 'This is not happening', 'GG'])
    );
  });
});

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

const characterValue = new CharacterValuesDefinition(
  new ArrayView([
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
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition(
      'STR',
      '8',
      'The character physical force'
    ),
    new KeyValueDescriptionDefinition(
      'VIT',
      '9',
      'The character body constitution'
    ),
    new KeyValueDescriptionDefinition('SIZ', '10', 'The character body shape'),
    new KeyValueDescriptionDefinition('AGI', '11', 'The character agility'),
    new KeyValueDescriptionDefinition(
      'INT',
      '12',
      'The character intelligence'
    ),
    new KeyValueDescriptionDefinition(
      'POW',
      '13',
      'The character mental strength'
    ),
    new KeyValueDescriptionDefinition('APP', '14', 'The character looks'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('HP', '9', 'The character hit points'),
    new KeyValueDescriptionDefinition('PP', '13', 'The character power points'),
    new KeyValueDescriptionDefinition('MOV', '10', 'The character movement'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('Appraise', '12', ''),
    new KeyValueDescriptionDefinition(
      'Dodge',
      '32',
      'Ability to avoid being hit'
    ),
  ])
);

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
