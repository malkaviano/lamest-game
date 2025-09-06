import { TestBed } from '@angular/core/testing';
import { SoundService } from './sound.service';

describe('SoundService', () => {
  let service: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have toggleSound method', () => {
    expect(service.toggleSound).toBeDefined();
  });

  it('should have setVolume method', () => {
    expect(service.setVolume).toBeDefined();
  });

  it('should have playSound method', () => {
    expect(service.playSound).toBeDefined();
  });

  it('should not throw error when playing sound', () => {
    expect(() => service.playSound('EQUIPPED')).not.toThrow();
  });
});