import { actionableDefinitions } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { ClosedContainerState } from './closed-container.state';

const state = new ClosedContainerState('id1', new ArrayView([]));

const openAction = actionableDefinitions['OPEN']('id1', 'Open');
const closeAction = actionableDefinitions['CLOSE']('id1', 'Close');
const pickAction = actionableDefinitions['PICK']('id1', 'Pick');

describe('ClosedContainerState', () => {
  describe('actions', () => {
    it('return OPEN', () => {
      expect(state.actions).toEqual(new ArrayView([openAction]));
    });
  });

  describe('execute', () => {
    describe('actionable is OPEN', () => {
      it('return OpenedContainerState', () => {
        const result = state.execute(openAction);

        expect(result.name).toEqual('ContainerOpenedState');
      });
    });

    describe('actionable is PICK', () => {
      it('throws Illegal Action Performed', () => {
        expect(() => state.execute(pickAction)).toThrowError(
          'Illegal Action Performed'
        );
      });
    });

    describe('actionable is CLOSE', () => {
      it('throws Illegal Action Performed', () => {
        expect(() => state.execute(closeAction)).toThrowError(
          'Illegal Action Performed'
        );
      });
    });
  });
});
