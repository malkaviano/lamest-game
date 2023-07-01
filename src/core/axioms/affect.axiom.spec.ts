import { deepEqual, instance, when } from 'ts-mockito';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { AffectAxiom } from './affect.axiom';
import { EffectEvent } from '../events/effect.event';

import { actionAffect } from '../../../tests/fakes';
import { mockedPlayerEntity } from '../../../tests/mocks';

describe('AffectedAxiom', () => {
  const axiom = new AffectAxiom();

  it('should be created', () => {
    expect(axiom).toBeTruthy();
  });

  describe('affectWith', () => {
    const effect = new EffectEvent('KINETIC', 5);

    describe('when actor dies', () => {
      it('should log effects and actor died', (done) => {
        const result: LogMessageDefinition[] = [];

        axiom.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        when(
          mockedPlayerEntity.reactTo(
            actionAffect,
            'SUCCESS',
            deepEqual({
              effect,
            })
          )
        ).thenReturn('test ok');

        when(mockedPlayerEntity.situation).thenReturn('DEAD');

        axiom.affectWith(
          instance(mockedPlayerEntity),
          actionAffect,
          'SUCCESS',
          {
            effect,
          }
        );

        done();

        expect(result).toEqual([
          new LogMessageDefinition('AFFECTED', 'Some Name', 'test ok'),
          new LogMessageDefinition('DIED', 'Some Name', 'is dead'),
        ]);
      });
    });
  });
});
