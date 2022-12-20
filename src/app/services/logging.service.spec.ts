import { TestBed } from '@angular/core/testing';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when message is logged', () => {
    it('emit an event', (done) => {
      let result: LogMessageDefinition | undefined;

      service.gameLog$.subscribe((event) => {
        result = event;
      });

      service.log(log);

      done();

      expect(result).toEqual(log);
    });
  });
});

const log = new LogMessageDefinition('CHECK', 'me', 'GG');
