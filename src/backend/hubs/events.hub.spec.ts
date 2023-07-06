import { instance } from 'ts-mockito';

import { EventsHub } from './events.hub';

import {
  mockedActivationAxiom,
  mockedAffectedAxiom,
  mockedDodgeAxiom,
  mockedPolicyHub,
  mockedReadAxiom,
  mockedRollHelper,
  mockedRulesHub,
} from '../../../tests/mocks';

describe('EventsHub', () => {
  const service = new EventsHub(
    instance(mockedRollHelper),
    instance(mockedRulesHub),
    instance(mockedDodgeAxiom),
    instance(mockedActivationAxiom),
    instance(mockedAffectedAxiom),
    instance(mockedReadAxiom),
    instance(mockedPolicyHub)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});