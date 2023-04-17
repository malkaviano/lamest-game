import { deepEqual, instance, when } from 'ts-mockito';

import { ActivationAxiom } from './activation.axiom';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { createActionableDefinition } from '../../core/definitions/actionable.definition';

import { shadowDagger, shadowSword, simpleSword } from '../../../tests/fakes';
import { mockedPlayerEntity } from '../../../tests/mocks';

describe('ActivationAxiom', () => {
  const axiom = new ActivationAxiom();

  it('should be created', () => {
    expect(axiom).toBeTruthy();
  });

  describe('activation', () => {
    [
      {
        item: simpleSword,
        expected: true,
        log: undefined,
      },
      {
        item: shadowSword,
        expected: false,
        log: new LogMessageDefinition(
          'ACTIVATION',
          'Some Name',
          'not enough energy to activate Shadow Sword'
        ),
      },
      {
        item: shadowDagger,
        expected: true,
        log: new LogMessageDefinition(
          'ACTIVATION',
          'Some Name',
          'spent energy spent EP to activate Shadow Dagger'
        ),
      },
    ].forEach(({ item, expected, log }) => {
      describe(`when energyActivation was ${item.energyActivation}`, () => {
        it(`return ${expected}`, () => {
          const result = axiom.activation(instance(mockedPlayerEntity), item);

          expect(result).toEqual(expected);
        });

        it(`should produce logs ${expected}`, (done) => {
          when(
            mockedPlayerEntity.reactTo(
              deepEqual(
                createActionableDefinition(
                  'CONSUME',
                  'activation',
                  'Activation'
                )
              ),
              'NONE',
              deepEqual({
                energy: -item.energyActivation,
              })
            )
          ).thenReturn('energy spent');

          let result: LogMessageDefinition | undefined;

          axiom.logMessageProduced$.subscribe((event) => {
            result = event;
          });

          axiom.activation(instance(mockedPlayerEntity), item);

          done();

          expect(result).toEqual(log);
        });
      });
    });
  });
});
