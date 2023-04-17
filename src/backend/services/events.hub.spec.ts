import { instance } from 'ts-mockito';

import { EventsHub } from './events.hub';

import {
  mockedActivationAxiomService,
  mockedAffectedAxiomService,
  mockedDodgeAxiomService,
  mockedReadAxiomService,
  mockedRollHelper,
  mockedRuleDispatcherService,
} from '../../../tests/mocks';

describe('EventsHub', () => {
  const service = new EventsHub(
    instance(mockedRollHelper),
    instance(mockedRuleDispatcherService),
    instance(mockedDodgeAxiomService),
    instance(mockedActivationAxiomService),
    instance(mockedAffectedAxiomService),
    instance(mockedReadAxiomService)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
