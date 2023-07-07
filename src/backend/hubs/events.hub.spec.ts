import { instance } from 'ts-mockito';

import { EventsHub } from './events.hub';

import { mockedDodgeAxiom, mockedReadAxiom } from '../../../tests/mocks';

describe('EventsHub', () => {
  const service = new EventsHub(
    instance(mockedDodgeAxiom),
    instance(mockedReadAxiom)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
