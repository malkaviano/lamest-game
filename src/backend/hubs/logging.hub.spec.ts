import { instance } from 'ts-mockito';

import { LoggingHub } from '@hubs/logging.hub';

import {
  mockedPolicyHub,
  mockedRollHelper,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('LoggingHub', () => {
  const hub = new LoggingHub(
    instance(mockedRollHelper),
    instance(mockedRulesHub),
    instance(mockedPolicyHub)
  );

  it('should create an instance', () => {
    expect(hub).toBeTruthy();
  });
});
