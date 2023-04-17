import { instance } from 'ts-mockito';

import { ArrayView } from '../view-models/array.view';
import { SceneEntity } from './scene.entity';

import { mockedInteractiveEntity, setupMocks } from '../../../tests/mocks';

describe('SceneEntity', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('should have description', () => {
    expect(entity.description).toEqual('GG');
  });

  describe('reset', () => {
    it('should invoke reset on interactives', () => {
      spyOn(interactive, 'reset');

      entity.reset();

      expect(interactive.reset).toHaveBeenCalled();
    });
  });
});

const interactive = instance(mockedInteractiveEntity);

const entity = new SceneEntity(
  'GG',
  ArrayView.create([interactive]),
  {},
  'gg.jpg'
);
