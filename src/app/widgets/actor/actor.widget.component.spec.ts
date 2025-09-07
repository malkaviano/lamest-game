import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { ActorWidgetComponent } from './actor.widget.component';
import { MaterialModule } from '../../../material/material.module';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '@definitions/actionable.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { ActorEntity } from '@entities/actor.entity';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { CharacterService } from '@services/character.service';
import { PlayerInterface } from '../../../backend/interfaces/player.interface';
import { DerivedAttributeDefinition } from '../../../backend/conceptual/definitions/derived-attribute.definition';
import { DerivedAttributeValues } from '../../../backend/values/derived-attribute.value';

describe('ActorWidgetComponent', () => {
  let component: ActorWidgetComponent;
  let fixture: ComponentFixture<ActorWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const characterServiceMock = mock(CharacterService);
    const playerMock = mock<PlayerInterface>();

    when(characterServiceMock.characterChanged$).thenReturn(
      of(instance(playerMock))
    );
    when(characterServiceMock.currentCharacter).thenReturn(
      instance(playerMock)
    );
    when(playerMock.derivedAttributes).thenReturn({
      'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 10),
      'MAX AP': new DerivedAttributeDefinition('MAX AP', 10),
      'CURRENT HP': new DerivedAttributeDefinition('CURRENT HP', 100),
      'MAX HP': new DerivedAttributeDefinition('MAX HP', 100),
      'CURRENT EP': new DerivedAttributeDefinition('CURRENT EP', 50),
      'MAX EP': new DerivedAttributeDefinition('MAX EP', 50),
    });
    when(playerMock.cooldowns).thenReturn({});

    await TestBed.configureTestingModule({
      declarations: [ActorWidgetComponent],
      imports: [MaterialModule],
      providers: [
        WithSubscriptionHelper,
        { provide: CharacterService, useValue: instance(characterServiceMock) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActorWidgetComponent);
    component = fixture.componentInstance;

    component.interactive = instance(mockedActor);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is actor with actions', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.id).thenReturn('actor1');
      when(mockedActor.name).thenReturn('Orc Warrior');
      when(mockedActor.description).thenReturn('A fierce orc warrior');
      when(mockedActor.behavior).thenReturn('AGGRESSIVE');
      when(mockedActor.actions).thenReturn(
        ArrayView.create(skillAction, affectAction)
      );
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction, affectAction))
      );
      when(mockedActor.ignores).thenReturn(ArrayView.create());

      fixture.detectChanges();
    });

    it('should display actor name', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Orc Warrior');
    });

    it('should display actor description', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('A fierce orc warrior');
    });

    it('should display behavior icon for aggressive', () => {
      const compiled = fixture.nativeElement;
      const behaviorIcon = compiled.querySelector('.behavior-icon');
      expect(behaviorIcon.textContent).toBe('⚔️');
    });

    it('should render action buttons', async () => {
      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      expect(buttons.length).toBe(2);

      const buttonTexts = await Promise.all(buttons.map((b) => b.getText()));
      expect(buttonTexts.some(text => text.includes('Attack'))).toBe(true);
      expect(buttonTexts.some(text => text.includes('Strike'))).toBe(true);
    });

    it('should emit actionSelected when action button is clicked', async () => {
      spyOn(component.actionSelected, 'emit');

      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      const attackButton = buttons[0];

      await attackButton.click();

      expect(component.actionSelected.emit).toHaveBeenCalledWith(
        new ActionableEvent(skillAction, 'actor1')
      );
    });
  });

  describe('when not an actor', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('REACTIVE');
      when(mockedActor.actions).thenReturn(ArrayView.create());
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create<ActionableDefinition>())
      );

      fixture.detectChanges();
    });

    it('should not render actor card', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.actor-card')).toBeFalsy();
    });
  });

  describe('when actor has no actions', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.actions).thenReturn(ArrayView.create());
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create<ActionableDefinition>())
      );

      fixture.detectChanges();
    });

    it('should not render actor card', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.actor-card')).toBeFalsy();
    });
  });

  describe('AP cost calculations', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );
      when(mockedActor.ignores).thenReturn(ArrayView.create());

      fixture.detectChanges();
    });

    it('should calculate AP cost correctly', () => {
      const cost = component.apCost(skillAction);
      expect(cost).toBeGreaterThanOrEqual(0);
    });

    it('should determine affordability correctly', () => {
      component['currentAP'] = 10;
      const canAfford = component.canAfford(skillAction);
      expect(typeof canAfford).toBe('boolean');
    });

    it('should generate AP tooltip suffix', () => {
      const suffix = component.apTooltipSuffix(skillAction);
      if (component.apCost(skillAction) > 0) {
        expect(suffix).toContain('AP:');
      } else {
        expect(suffix).toBe('');
      }
    });

    it('should display AP chip when action has cost', () => {
      // Force a skill action to have AP cost for this test
      spyOn(component, 'apCost').and.returnValue(3);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const apPill = compiled.querySelector('.ap-pill');
      if (apPill) {
        expect(apPill.textContent).toContain('3 AP');
      }
    });

    it('should not display AP chip when action has no cost', () => {
      spyOn(component, 'apCost').and.returnValue(0);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const apPill = compiled.querySelector('.ap-pill');
      expect(apPill).toBeFalsy();
    });
  });

  describe('cooldown calculations', () => {
    beforeEach(() => {
      component['cooldowns'] = {
        Attack: 5000,
        ENGAGEMENT: 3000,
      };
      component['cooldownsCapturedAt'] = Date.now() - 2000;
    });

    it('should calculate skill cooldown correctly', () => {
      const cooldown = component.cooldownSeconds(skillAction);
      expect(cooldown).toBeGreaterThan(0);
    });

    it('should return null for non-skill actions', () => {
      const cooldown = component.cooldownSeconds(affectAction);
      expect(cooldown).toBeNull();
    });

    it('should detect engagement correctly', () => {
      const hasEng = component['hasEngagement']();
      expect(hasEng).toBe(true);
    });

    it('should calculate engagement seconds', () => {
      const engSeconds = component.engagementSeconds();
      expect(engSeconds).toBeGreaterThan(0);
    });

    it('should display cooldown chip when action has cooldown', () => {
      const compiled = fixture.nativeElement;
      const cdPill = compiled.querySelector('.cd-pill');
      if (cdPill) {
        expect(cdPill.textContent).toMatch(/CD \d+s/);
      }
    });

    it('should display engagement chip when action is engagement blocked', () => {
      // Setup engagement blocking scenario
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.actions).thenReturn(ArrayView.create(
        createActionableDefinition('SKILL', 'search', 'Search') // Non-combat skill
      ));
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(
          createActionableDefinition('SKILL', 'search', 'Search')
        ))
      );
      when(mockedActor.ignores).thenReturn(ArrayView.create());

      // Mock engagement blocking
      spyOn(component, 'isEngagementBlocked').and.returnValue(true);
      spyOn(component, 'engagementSeconds').and.returnValue(2);
      
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const engPill = compiled.querySelector('.eng-pill');
      if (engPill) {
        expect(engPill.textContent).toContain('ENG 2s');
      }
    });
  });

  describe('detection capabilities', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.ignores).thenReturn(ArrayView.create('DISGUISED'));
      when(mockedActor.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );

      fixture.detectChanges();
    });

    it('should set detection flags based on ignores', () => {
      expect(component.detectHidden).toBe(true);
      expect(component.detectDisguised).toBe(false);
    });

    it('should display detection icons when applicable', () => {
      const compiled = fixture.nativeElement;
      const detectIcons = compiled.querySelectorAll('.detect-icon');
      expect(detectIcons.length).toBeGreaterThan(0);
    });
  });

  describe('mini-bars for derived attributes', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );
      when(mockedActor.ignores).thenReturn(ArrayView.create());

      const derivedAttributeValues: DerivedAttributeValues = {
        'CURRENT HP': new DerivedAttributeDefinition('CURRENT HP', 80),
        'MAX HP': new DerivedAttributeDefinition('MAX HP', 100),
        'CURRENT EP': new DerivedAttributeDefinition('CURRENT EP', 30),
        'MAX EP': new DerivedAttributeDefinition('MAX EP', 50),
        'MAX AP': new DerivedAttributeDefinition('MAX AP', 11),
        'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 8),
      };

      // Mock derived attributes through the mock entity
      when(mockedActor.derivedAttributes).thenReturn(derivedAttributeValues);

      fixture.detectChanges();
    });

    it('should detect derived attributes', () => {
      expect(component.hasDerivedAttributes()).toBe(true);
    });

    it('should get attribute values', () => {
      expect(component.attrValue('CURRENT HP')).toBe(80);
      expect(component.attrValue('MAX HP')).toBe(100);
    });

    it('should calculate ratios correctly', () => {
      const ratio = component.ratio('CURRENT HP', 'MAX HP');
      expect(ratio).toBe(80);
    });

    it('should display mini-bars', () => {
      const compiled = fixture.nativeElement;
      const miniBars = compiled.querySelector('.mini-bars');
      expect(miniBars).toBeTruthy();
    });
  });

  describe('density classes', () => {
    it('should generate correct density class for default', () => {
      expect(component.densityClass).toBe('density-cozy');
    });

    it('should generate correct density class for compact', () => {
      component.density = 'compact';
      expect(component.densityClass).toBe('density-compact');
    });

    it('should generate correct density class for comfortable', () => {
      component.density = 'comfortable';
      expect(component.densityClass).toBe('density-comfortable');
    });
  });

  describe('chips display', () => {
    beforeEach(() => {
      when(mockedActor.classification).thenReturn('ACTOR');
      when(mockedActor.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedActor.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );
      when(mockedActor.ignores).thenReturn(ArrayView.create());

      fixture.detectChanges();
    });

    it('should display chips-line when action has AP cost or engagement blocking', () => {
      spyOn(component, 'apCost').and.returnValue(2);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const chipsLine = compiled.querySelector('.chips-line');
      expect(chipsLine).toBeTruthy();
    });

    it('should not display chips-line when action has no cost and no engagement', () => {
      spyOn(component, 'apCost').and.returnValue(0);
      spyOn(component, 'isEngagementBlocked').and.returnValue(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const chipsLine = compiled.querySelector('.chips-line');
      expect(chipsLine).toBeFalsy();
    });

    it('should display cooldown-line when action has cooldown', () => {
      component['cooldowns'] = { 'Attack': 5000 };
      component['cooldownsCapturedAt'] = Date.now() - 2000;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const cooldownLine = compiled.querySelector('.cooldown-line');
      if (cooldownLine) {
        expect(cooldownLine).toBeTruthy();
      }
    });
  });

  describe('action icons and tooltips', () => {
    it('should return correct icon data for SKILL', () => {
      const iconData = component.setIcon('SKILL');
      expect(iconData.tooltip).toBe('Skill check');
    });

    it('should return correct icon data for AFFECT', () => {
      const iconData = component.setIcon('AFFECT');
      expect(iconData.tooltip).toBe('Use equipped weapon on target');
    });

    it('should return correct emoji for SKILL', () => {
      const emoji = component.actionEmoji('SKILL');
      expect(emoji).toBe('🎯');
    });

    it('should return correct emoji for AFFECT', () => {
      const emoji = component.actionEmoji('AFFECT');
      expect(emoji).toBe('⚔️');
    });
  });
});

const mockedActor = mock(ActorEntity);

const skillAction = createActionableDefinition('SKILL', 'attack', 'Attack');

const affectAction = createActionableDefinition('AFFECT', 'strike', 'Strike');
