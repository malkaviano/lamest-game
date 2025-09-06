import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from './feedback.service';
import { SoundService } from './sound.service';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { mock, instance } from 'ts-mockito';

describe('FeedbackService', () => {
  let service: FeedbackService;
  const mockedToastrService = mock(ToastrService);
  const mockedSoundService = mock(SoundService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastrService,
          useValue: instance(mockedToastrService),
        },
        {
          provide: SoundService,
          useValue: instance(mockedSoundService),
        },
      ],
    });
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show feedback for log message', () => {
    const log = new LogMessageDefinition('EQUIPPED', 'Player', 'Equipped sword');
    expect(() => service.showFeedback(log)).not.toThrow();
  });
});