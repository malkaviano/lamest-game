import { instance } from 'ts-mockito';

import { EventsHub } from './events.hub';

import {
  mockedActivationAxiom,
  mockedAffectedAxiom,
  mockedDodgeAxiom,
  mockedReadAxiom,
  mockedRollHelper,
  mockedRuleDispatcherService,
} from '../../../tests/mocks';

describe('EventsHub', () => {
  const service = new EventsHub(
    instance(mockedRollHelper),
    instance(mockedRuleDispatcherService),
    instance(mockedDodgeAxiom),
    instance(mockedActivationAxiom),
    instance(mockedAffectedAxiom),
    instance(mockedReadAxiom)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
