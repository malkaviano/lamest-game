import { instance } from 'ts-mockito';

import { LoggingHub } from '@hubs/logging.hub';

import {
  mockedActivationAxiom,
  mockedPolicyHub,
  mockedRollHelper,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRollHelper),
    instance(mockedRulesHub),
    instance(mockedActivationAxiom),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
