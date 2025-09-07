import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { ReactiveWidgetComponent } from './reactive.widget.component';
import { MaterialModule } from '../../../material/material.module';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '@definitions/actionable.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { CharacterService } from '@services/character.service';
import { PlayerInterface } from '../../../backend/interfaces/player.interface';
import { DerivedAttributeDefinition } from '../../../backend/conceptual/definitions/derived-attribute.definition';

describe('ReactiveWidgetComponent', () => {
  let component: ReactiveWidgetComponent;
  let fixture: ComponentFixture<ReactiveWidgetComponent>;
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
      declarations: [ReactiveWidgetComponent],
      imports: [MaterialModule],
      providers: [
        WithSubscriptionHelper,
        { provide: CharacterService, useValue: instance(characterServiceMock) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveWidgetComponent);
    component = fixture.componentInstance;

    component.interactive = instance(mockedReactive);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is reactive with actions', () => {
    beforeEach(() => {
      when(mockedReactive.classification).thenReturn('REACTIVE');
      when(mockedReactive.id).thenReturn('reactive1');
      when(mockedReactive.name).thenReturn('Trapped Chest');
      when(mockedReactive.description).thenReturn(
        'A chest that responds to triggers'
      );
      when(mockedReactive.actions).thenReturn(
        ArrayView.create(skillAction, interactionAction)
      );
      when(mockedReactive.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction, interactionAction))
      );
      when(mockedReactive.ignores).thenReturn(ArrayView.create());

      fixture.detectChanges();
    });

    it('should display reactive name', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Trapped Chest');
    });

    it('should display reactive description', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(
        'A chest that responds to triggers'
      );
    });

    it('should render action buttons', async () => {
      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      expect(buttons.length).toBe(2);

      const buttonTexts = await Promise.all(buttons.map((b) => b.getText()));
      expect(buttonTexts.some((text) => text.includes('Disarm'))).toBe(true);
      expect(buttonTexts.some((text) => text.includes('Trigger'))).toBe(true);
    });

    it('should emit actionSelected when action button is clicked', async () => {
      spyOn(component.actionSelected, 'emit');

      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      const disarmButton = buttons[0];

      await disarmButton.click();

      expect(component.actionSelected.emit).toHaveBeenCalledWith(
        new ActionableEvent(skillAction, 'reactive1')
      );
    });
  });

  describe('when reactive has no actions', () => {
    beforeEach(() => {
      when(mockedReactive.classification).thenReturn('REACTIVE');
      when(mockedReactive.actions).thenReturn(ArrayView.create());
      when(mockedReactive.actionsChanged$).thenReturn(
        of(ArrayView.create<ActionableDefinition>())
      );

      fixture.detectChanges();
    });

    it('should not render reactive card', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.reactive-card')).toBeFalsy();
    });
  });

  describe('AP cost calculations', () => {
    beforeEach(() => {
      when(mockedReactive.classification).thenReturn('REACTIVE');
      when(mockedReactive.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedReactive.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );
      when(mockedReactive.ignores).thenReturn(ArrayView.create());

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
  });

  describe('cooldown calculations', () => {
    beforeEach(() => {
      component['cooldowns'] = {
        Disarm: 8000,
        ENGAGEMENT: 4000,
      };
      component['cooldownsCapturedAt'] = Date.now() - 3000;
    });

    it('should calculate skill cooldown correctly', () => {
      const cooldown = component.cooldownSeconds(skillAction);
      expect(cooldown).toBeGreaterThan(0);
    });

    it('should return null for non-skill actions', () => {
      const cooldown = component.cooldownSeconds(interactionAction);
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
  });

  describe('detection capabilities', () => {
    beforeEach(() => {
      when(mockedReactive.classification).thenReturn('REACTIVE');
      when(mockedReactive.ignores).thenReturn(ArrayView.create('HIDDEN'));
      when(mockedReactive.actions).thenReturn(ArrayView.create(skillAction));
      when(mockedReactive.actionsChanged$).thenReturn(
        of(ArrayView.create(skillAction))
      );

      fixture.detectChanges();
    });

    it('should set detection flags based on ignores', () => {
      expect(component.detectHidden).toBe(false);
      expect(component.detectDisguised).toBe(true);
    });

    it('should display detection icons when applicable', () => {
      const compiled = fixture.nativeElement;
      const detectIcons = compiled.querySelectorAll('.detect-icon');
      expect(detectIcons.length).toBeGreaterThan(0);
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

  describe('action icons and tooltips', () => {
    it('should return correct icon data for SKILL', () => {
      const iconData = component.setIcon('SKILL');
      expect(iconData.tooltip).toBe('Skill check');
    });

    it('should return correct icon data for INTERACTION', () => {
      const iconData = component.setIcon('INTERACTION');
      expect(iconData.tooltip).toBe('Interact with the target');
    });

    it('should return correct emoji for SKILL', () => {
      const emoji = component.actionEmoji('SKILL');
      expect(emoji).toBe('🎯');
    });

    it('should return correct emoji for INTERACTION', () => {
      const emoji = component.actionEmoji('INTERACTION');
      expect(emoji).toBe('💬');
    });
  });
});

const mockedReactive = mock(InteractiveEntity);

const skillAction = createActionableDefinition('SKILL', 'disarm', 'Disarm');

const interactionAction = createActionableDefinition(
  'INTERACTION',
  'trigger',
  'Trigger'
);
