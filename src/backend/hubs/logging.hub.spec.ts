import { instance } from 'ts-mockito';

import { LoggingHub } from '@hubs/logging.hub';

import {
  mockedPolicyHub,
  mockedRpgService,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRpgService),
    instance(mockedRulesHub),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
