import { createActionableDefinition } from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableEvent } from '../events/actionable.event';
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

  describe('run', () => {
    describe('when wrong action is received', () => {
      it('throws SHOULD-NOT-HAPPEN', () => {
        expect(() =>
          entity.run(
            new ActionableEvent(
              createActionableDefinition('CLOSE', 'NOP'),
              'someId'
            ),
            'NONE'
          )
        ).toThrowError(errorMessages['SHOULD-NOT-HAPPEN']);
      });
    });
  });
});

const descriptions = new ArrayView(['GG']);

const interactive = new InteractiveEntity(
  'id1',
  'inter1',
  'GG',
  new SimpleState([])
);

const entity = new SceneEntity(descriptions, new ArrayView([interactive]), {});
