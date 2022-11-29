import { SimpleState } from '../states/simple.state';
import { ArrayView } from '../views/array.view';
import { InteractiveEntity } from './interactive.entity';
import { SceneEntity } from './scene.entity';

describe('SceneEntity', () => {
  it('should have description', () => {
    expect(entity.description).toEqual(descriptions);
  });

  describe('reset', () => {
    it('should invoke reset on interactives', () => {
      spyOn(interactive, 'reset');

      entity.reset();

      expect(interactive.reset).toHaveBeenCalled();
    });
  });
});

const descriptions = new ArrayView(['GG']);

const interactive = new InteractiveEntity(
  'id1',
  'inter1',
  'GG',
  new SimpleState(new ArrayView([]))
);

const entity = new SceneEntity(descriptions, new ArrayView([interactive]), {});
