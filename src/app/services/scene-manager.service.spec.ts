import { TestBed } from '@angular/core/testing';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SimpleState } from '../states/simple.state';

import { SceneManagerService } from './scene-manager.service';

describe('SceneManagerService', () => {
  let service: SceneManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SceneManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Most wrong test evar made, inject this shit
  describe('Action received', () => {
    describe('when a SCENE is received', () => {
      it('change the current scene', (done) => {
        service.sceneChanged$.subscribe((s) => {
          expect(s).toBeTruthy();
        });

        service.run(
          createActionableDefinition('SCENE', 'sceneExitDoor', 'exit', 'Exit'),
          'NONE'
        );

        done();
      });

      it('return scene trigger interactive', () => {
        const result = service.run(
          createActionableDefinition('SCENE', 'sceneExitDoor', 'exit', 'Exit'),
          'NONE'
        );

        expect(result).toEqual(
          new InteractiveEntity(
            'sceneExitDoor',
            'Exit Door',
            'Demo Simple Interactable',
            new SimpleState('sceneExitDoor', [
              createActionableDefinition(
                'SCENE',
                'sceneExitDoor',
                'exit',
                'Exit'
              ),
            ])
          )
        );
      });
    });

    describe('when a NON SCENE is received', () => {
      it('return interactive with state change', () => {
        const result = service.run(
          createActionableDefinition('SKILL', 'athleticism', 'Athleticism'),
          'SUCCESS'
        );

        expect(result.id).toEqual('athleticism');
      });
    });
  });
});
