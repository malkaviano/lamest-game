import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { EffectEvent } from '../events/effect.event';
import { AffectAxiomService } from './affect.axiom.service';

import { actionAttack } from '../../../tests/fakes';
import { mockedPlayerEntity } from '../../../tests/mocks';

describe('AffectedAxiomService', () => {
  let service: AffectAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('affectWith', () => {
    const effect = new EffectEvent('KINETIC', 5);

    describe('when actor dies', () => {
      it('should log effects and actor died', (done) => {
        const result: LogMessageDefinition[] = [];

        service.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        when(
          mockedPlayerEntity.reactTo(
            actionAttack,
            'SUCCESS',
            deepEqual({
              effect,
            })
          )
        ).thenReturn('test ok');

        when(mockedPlayerEntity.situation).thenReturn('DEAD');

        service.affectWith(
          instance(mockedPlayerEntity),
          actionAttack,
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