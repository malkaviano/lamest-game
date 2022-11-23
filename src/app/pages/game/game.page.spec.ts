import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePage } from './game.page';
import { ArrayView } from '../../views/array.view';
import { CharacterEntity } from '../../entities/character.entity';
import { IdentityDefinition } from '../../definitions/identity.definition';
import { CharacteristicsDefinition } from '../../definitions/characteristics.definition';
import { CharacteristicDefinition } from '../../definitions/characteristic.definition';
import { SkillNameLiteral } from '../../literals/skill-name.literal';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { GameManagerService } from '../../services/game-manager.service';
import { GameEventsDefinition } from '../../definitions/game-events.definition';
import { createActionableDefinition } from '../../definitions/actionable.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { WeaponDefinition } from '../../definitions/weapon.definition';
import { ActionableItemDefinition } from '../../definitions/actionable-item.definition';

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      declarations: [GamePage],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GameManagerService,
          useValue: instance(mockedGameManagerService),
        },
      ],
    }).compileComponents();

    when(mockedGameManagerService.events).thenReturn(
      instance(mockedGameEventsService)
    );

    when(mockedGameEventsService.characterChanged$).thenReturn(
      of(characterEntity)
    );

    when(mockedGameEventsService.sceneChanged$).thenReturn(of(scene));

    when(mockedGameEventsService.playerInventory$).thenReturn(
      of({
        items: new ArrayView([
          new ActionableItemDefinition(weapon1, askAction),
          new ActionableItemDefinition(weapon2, askAction),
        ]),
        equipped: null,
      })
    );

    when(mockedGameEventsService.actionLogged$).thenReturn(
      of('OMG', 'This is not happening', 'GG')
    );

    fixture = TestBed.createComponent(GamePage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have identity values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="character"]`)
    );

    const result = widget.query(By.css(`[data-testid="identity"]`)).children
      .length;

    expect(result).toEqual(7);
  });

  it(`should have characteristic values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="character"]`)
    );

    const result = widget.query(By.css(`[data-testid="characteristics"]`))
      .children.length;

    expect(result).toEqual(7);
  });

  it(`should have derived attributes values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="character"]`)
    );

    const result = widget.query(By.css(`[data-testid="derived-attributes"]`))
      .children.length;

    expect(result).toEqual(3);
  });

  it(`should have skills values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="character"]`)
    );

    const result = widget.query(By.css(`[data-testid="skills"]`)).children
      .length;

    expect(result).toEqual(2);
  });

  it(`should have description`, () => {
    const result = fixture.debugElement.query(
      By.css('[data-testid="description"]')
    );

    expect(result).not.toBeNull();

    expect(component.scene.description.items.length).toEqual(2);
  });

  it(`should have interactibles`, () => {
    const result = fixture.debugElement.query(
      By.css('[data-testid="interactables"]')
    );

    expect(result.children.length).toEqual(1);
  });

  it(`should have action log`, () => {
    const result = fixture.debugElement.query(By.css('[data-testid="log"]'));

    expect(result).not.toBeNull();

    expect(component.logs.items.length).toEqual(3);
  });

  it(`should have inventory`, () => {
    const result = fixture.debugElement.query(
      By.css('[data-testid="inventory"]')
    );

    expect(result).not.toBeNull();

    expect(component.inventory.length).toEqual(2);
  });

  describe('actionSelected', () => {
    it('should send an ActionableEvent', () => {
      const event = new ActionableEvent(askAction, 'id1');

      let result: ActionableEvent | null = null;

      when(mockedGameEventsService.registerActionableTaken).thenReturn(
        (actionableEvent: ActionableEvent) => {
          result = actionableEvent;
        }
      );

      component.actionSelected(event);

      expect(result).not.toBeNull();
    });
  });
});

const characterEntity = new CharacterEntity(
  new IdentityDefinition(
    'name',
    'Hunter',
    'FEMALE',
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  new CharacteristicsDefinition(
    new CharacteristicDefinition('STR', 8),
    new CharacteristicDefinition('CON', 9),
    new CharacteristicDefinition('SIZ', 10),
    new CharacteristicDefinition('DEX', 11),
    new CharacteristicDefinition('INT', 12),
    new CharacteristicDefinition('POW', 13),
    new CharacteristicDefinition('APP', 14)
  ),
  new Map<SkillNameLiteral, number>([
    ['Appraise', 0],
    ['Dodge', 10],
  ])
);

const askAction = createActionableDefinition('ASK', 'action1', 'Got action?');

const scene = new SceneDefinition(
  new ArrayView(['this is a test', 'okay okay']),
  new ArrayView([
    new InteractiveEntity(
      'id1',
      'props1',
      'This is props1',
      new SimpleState([askAction])
    ),
  ])
);

const mockedGameManagerService = mock(GameManagerService);
const mockedGameEventsService = mock(GameEventsDefinition);

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust'
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Decent Sword',
  'A good sword, not exceptional'
);
