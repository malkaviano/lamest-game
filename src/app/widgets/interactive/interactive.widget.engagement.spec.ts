import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { InteractiveWidgetComponent } from './interactive.widget.component';
import { MaterialModule } from '../../../material/material.module';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';
import { CharacterService } from '@services/character.service';

describe('InteractiveWidgetComponent (engagement + scene)', () => {
  let fixture: ComponentFixture<InteractiveWidgetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveWidgetComponent],
      imports: [MaterialModule],
      providers: [
        {
          provide: CharacterService,
          useValue: stubCharacterService({
            // Enough AP to afford SCENE (1 AP in settings)
            'CURRENT AP': 5,
            'MAX AP': 5,
          }, { ENGAGEMENT: 10000 }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveWidgetComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);

    const mockedInteractive = mock(InteractiveEntity);
    when(mockedInteractive.actionsChanged$).thenReturn(
      of(ArrayView.create(sceneAction))
    );
    when(mockedInteractive.id).thenReturn('id-scene');
    when(mockedInteractive.name).thenReturn('Travel Point');
    when(mockedInteractive.description).thenReturn('Go to another scene');

    fixture.componentInstance.interactive = instance(mockedInteractive);
    fixture.detectChanges();
  });

  it('keeps SCENE action enabled during ENGAGEMENT when AP is sufficient', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const sceneBtn = buttons[0];
    const disabled = await sceneBtn.isDisabled();
    expect(disabled).toBeFalse();
  });
});

const sceneAction = createActionableDefinition('SCENE', 'exit', 'Exit');

function stubCharacterService(
  derived: Record<string, number>,
  cooldowns: Record<string, number>
) {
  const char = {
    derivedAttributes: Object.keys(derived).reduce((acc, k) => {
      (acc as any)[k] = { value: derived[k] };
      return acc;
    }, {} as Record<string, { value: number }>),
    cooldowns,
  };
  return {
    currentCharacter: char,
    characterChanged$: of(char),
  } as Partial<CharacterService>;
}

