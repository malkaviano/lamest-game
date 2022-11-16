import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs';

import { SceneEntity } from './entities/scene.entity';
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
        let result: SceneEntity | undefined;

        service.sceneChanged$
          .pipe(first())
          .subscribe((scene) => (result = scene));

        expect(result?.id).toEqual('scene1');
      });
    });
  });
});
