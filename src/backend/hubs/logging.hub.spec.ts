import { instance } from 'ts-mockito';

import { LoggingHub } from '@hubs/logging.hub';

import {
  mockedActivationAxiom,
  mockedAffectedAxiom,
  mockedPolicyHub,
  mockedRollHelper,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRollHelper),
    instance(mockedRulesHub),
    instance(mockedActivationAxiom),
    instance(mockedAffectedAxiom),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
