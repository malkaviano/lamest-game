import { actionableDefinitions } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { ClosedContainerState } from './closed-container.state';

const state = new ClosedContainerState(new ArrayView([]));

describe('ClosedContainerState', () => {
  describe('actions', () => {
    it('return OPEN', () => {
      expect(state.actions).toEqual(
        new ArrayView([actionableDefinitions['OPEN']])
      );
    });
  });

  describe('execute', () => {
    describe('actionable is OPEN', () => {
      it('return OpenedContainerState', () => {
        const result = state.execute(actionableDefinitions['OPEN']);

        expect(result.id).toEqual('ContainerOpenedState');
      });
    });

    describe('actionable is PICK', () => {
      it('throws Illegal Action Performed', () => {
        expect(() => state.execute(actionableDefinitions['PICK'])).toThrowError(
          'Illegal Action Performed'
        );
      });
    });

    describe('actionable is CLOSE', () => {
      it('throws Illegal Action Performed', () => {
        expect(() =>
          state.execute(actionableDefinitions['CLOSE'])
        ).toThrowError('Illegal Action Performed');
      });
    });
  });
});
