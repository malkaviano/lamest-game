import { instance } from 'ts-mockito';

import { ArrayView } from '../views/array.view';
import { SceneEntity } from './scene.entity';

import { mockedInteractiveEntity, setupMocks } from '../../../tests/mocks';

describe('SceneEntity', () => {
  beforeEach(() => {
    setupMocks();
  });

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

const interactive = instance(mockedInteractiveEntity);

const entity = new SceneEntity(descriptions, new ArrayView([interactive]), {});
