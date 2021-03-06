import { TestBed } from '@angular/core/testing';
import { first, take } from 'rxjs';

import { Scene } from './definitions/scene.definition';
import { SelectedAction } from './definitions/selected-action.definition';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
  let service: GameManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('current scene', () => {
    describe('when starting the game', () => {
      it('should be scene1', () => {
        let result: Scene | undefined;

        service.sceneChanged$
          .pipe(first())
          .subscribe((scene) => (result = scene));

        expect(result?.id).toEqual('scene1');
      });
    });

    describe('when sceneChanged event occurs', () => {
      it('should be scene2', () => {
        let result: Scene | undefined;

        service.sceneChanged$
          .pipe(take(2))
          .subscribe((scene) => (result = scene));

        service.registerEvent(new SelectedAction('exit_room1', 'exit1'));

        expect(result?.id).toEqual('scene2');
      });
    });
  });
});
