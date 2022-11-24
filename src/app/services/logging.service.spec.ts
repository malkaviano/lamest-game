import { TestBed } from '@angular/core/testing';

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
      let result: string | undefined;

      service.gameLog$.subscribe((event) => {
        result = event;
      });

      service.log('GG');

      done();

      expect(result).toEqual('GG');
    });
  });
});
