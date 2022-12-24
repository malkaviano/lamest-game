import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { ActivationAxiomService } from './activation.axiom.service';
import { LogMessageDefinition } from '../../definitions/log-message.definition';
import { createActionableDefinition } from '../../definitions/actionable.definition';

import {
  shadowDagger,
  shadowSword,
  simpleSword,
} from '../../../../tests/fakes';
import { mockedPlayerEntity } from '../../../../tests/mocks';

describe('ActivationAxiomService', () => {
  let service: ActivationAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
          const result = service.activation(instance(mockedPlayerEntity), item);

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

          service.logMessageProduced$.subscribe((event) => {
            result = event;
          });

          service.activation(instance(mockedPlayerEntity), item);

          done();

          expect(result).toEqual(log);
        });
      });
    });
  });
});
