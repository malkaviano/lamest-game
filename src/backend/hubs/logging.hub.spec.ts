import { instance } from 'ts-mockito';

import { LoggingHub } from '@hubs/logging.hub';

import {
  mockedPolicyHub,
  mockedRollService,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRollService),
    instance(mockedRulesHub),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
