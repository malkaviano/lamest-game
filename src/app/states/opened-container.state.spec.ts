import { actionableDefinitions } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { OpenedContainerState } from './opened-container.state';

const state = new OpenedContainerState(
  new ArrayView(['Sword', 'Milk', 'Gold'])
);

describe('OpenedContainerState', () => {
  describe('actions', () => {
    it('return OPEN', () => {
      expect(state.actions).toEqual(
        new ArrayView([
          actionableDefinitions['CLOSE'],
          actionableDefinitions['PICK'],
        ])
      );
    });
  });

  describe('execute', () => {
    describe('actionable is CLOSE', () => {
      it('return ClosedContainerState', () => {
        const result = state.execute(actionableDefinitions['CLOSE']);

        expect(result.id).toEqual('ContainerClosedState');
      });
    });

    describe('actionable is PICK', () => {
      it('return ClosedContainerState', () => {
        const result = state.execute(actionableDefinitions['PICK']);

        expect(result.id).toEqual('ContainerOpenedState');
        expect((result as OpenedContainerState).items).toEqual(
          new ArrayView([])
        );
      });
    });

    describe('actionable is OPEN', () => {
      it('throws Illegal Action Performed', () => {
        expect(() => state.execute(actionableDefinitions['OPEN'])).toThrowError(
          'Illegal Action Performed'
        );
      });
    });
  });
});
