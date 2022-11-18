import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { GamePanelComponent } from './game-panel.component';
import { ArrayView } from '../../definitions/array-view.definition';
import { CharacterEntity } from '../../entities/character.entity';
import { CharacterIdentityDefinition } from '../../definitions/character-identity.definition';
import { CharacteristicsDefinition } from '../../definitions/characteristics.definition';
import { CharacteristicDefinition } from '../../definitions/characteristic.definition';
import { SkillNameLiteral } from '../../literals/skill-name.literal';
import { SceneDefinition } from '../../definitions/scene.definition';
import { InteractiveEntity } from '../../entities/interactive.entity';
import { SimpleState } from '../../states/simple.state';
import { actionableDefinitions } from '../../definitions/actionable.definition';
import { GameManagerService } from '../../services/game-manager.service';

describe('GamePanelComponent', () => {
  let component: GamePanelComponent;
  let fixture: ComponentFixture<GamePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      declarations: [GamePanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GameManagerService,
          useValue: instance(mockedGameManagerService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePanelComponent);

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

    expect(component.scene.description.keyValues.length).toEqual(2);
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

    expect(component.logs.length).toEqual(3);
  });
});

const characterEntity = new CharacterEntity(
  new CharacterIdentityDefinition(
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

const scene = new SceneDefinition(
  new ArrayView(['this is a test', 'okay okay']),
  new ArrayView([
    new InteractiveEntity(
      'id1',
      'props1',
      'This is props1',
      new SimpleState(
        'id1',
        [actionableDefinitions['ASK']('id1', 'action1', 'Got action?')],
        'none'
      )
    ),
  ])
);

const mockedGameManagerService = mock(GameManagerService);

when(mockedGameManagerService.characterChanged$).thenReturn(
  of(characterEntity)
);
when(mockedGameManagerService.sceneChanged$).thenReturn(of(scene));
when(mockedGameManagerService.actionLogged$).thenReturn(
  of('OMG', 'This is not happening', 'GG')
);
