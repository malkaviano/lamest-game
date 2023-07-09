import { deepEqual, instance, when } from 'ts-mockito';

import { ActivationAxiom } from './activation.axiom';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { createActionableDefinition } from '../definitions/actionable.definition';

import { shadowDagger, shadowSword, simpleSword } from '../../../tests/fakes';
import { mockedPlayerEntity, setupMocks } from '../../../tests/mocks';

describe('ActivationAxiom', () => {
  const axiom = new ActivationAxiom();

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(axiom).toBeTruthy();
  });

  describe('activation', () => {
    [
      {
        item: simpleSword,
        expected: false,
        log: undefined,
      },
      {
        item: shadowSword,
        expected: false,
        log: undefined,
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
        it(`${expected ? 'do' : 'do not'} activate`, () => {
          const actor = instance(mockedPlayerEntity);

          let result = false;

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
          ).thenCall(() => (result = true));

          axiom.activation(actor, item.energyActivation, item.identity.label);

          expect(result).toEqual(expected);
        });

        it(`should produce logs ${expected}`, (done) => {
          const actor = instance(mockedPlayerEntity);

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

          axiom.activation(actor, item.energyActivation, item.identity.label);

          done();

          expect(result).toEqual(log);
        });
      });
    });
  });
});
