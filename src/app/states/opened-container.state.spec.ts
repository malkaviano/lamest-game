import { actionableDefinitions } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { OpenedContainerState } from './opened-container.state';

const state = new OpenedContainerState(
  'id1',
  new ArrayView(['Sword', 'Milk', 'Gold'])
);

const openAction = actionableDefinitions['OPEN']('id1', 'Open');
const closeAction = actionableDefinitions['CLOSE']('id1', 'Close');
const pickAction = actionableDefinitions['PICK']('id1', 'Pick');

describe('OpenedContainerState', () => {
  describe('actions', () => {
    it('return OPEN', () => {
      expect(state.actions).toEqual(new ArrayView([closeAction, pickAction]));
    });
  });

  describe('execute', () => {
    describe('actionable is CLOSE', () => {
      it('return ClosedContainerState', () => {
        const result = state.execute(closeAction);

        expect(result.name).toEqual('ContainerClosedState');
      });
    });

    describe('actionable is PICK', () => {
      it('return ClosedContainerState', () => {
        const result = state.execute(pickAction);

        expect(result.name).toEqual('ContainerOpenedState');
        expect((result as OpenedContainerState).items).toEqual(
          new ArrayView([])
        );
      });
    });

    describe('actionable is OPEN', () => {
      it('throws Illegal Action Performed', () => {
        expect(() => state.execute(openAction)).toThrowError(
          'Illegal Action Performed'
        );
      });
    });
  });
});
