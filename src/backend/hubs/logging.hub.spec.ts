import { instance } from 'ts-mockito';

import { LoggingHub } from './logging.hub';
import {
  mockedActivationAxiom,
  mockedAffectedAxiom,
  mockedDodgeAxiom,
  mockedPolicyHub,
  mockedRollHelper,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRollHelper),
    instance(mockedRulesHub),
    instance(mockedDodgeAxiom),
    instance(mockedActivationAxiom),
    instance(mockedAffectedAxiom),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
