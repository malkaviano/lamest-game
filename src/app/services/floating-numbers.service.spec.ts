import { TestBed } from '@angular/core/testing';
import { ComponentFactoryResolver } from '@angular/core';
import { FloatingNumbersService } from './floating-numbers.service';
import { mock, instance } from 'ts-mockito';

describe('FloatingNumbersService', () => {
  let service: FloatingNumbersService;
  const mockedComponentFactoryResolver = mock(ComponentFactoryResolver);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ComponentFactoryResolver,
          useValue: instance(mockedComponentFactoryResolver),
        },
      ],
    });
    service = TestBed.inject(FloatingNumbersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have showDamage method', () => {
    expect(service.showDamage).toBeDefined();
  });

  it('should have showHealing method', () => {
    expect(service.showHealing).toBeDefined();
  });

  it('should have showExperience method', () => {
    expect(service.showExperience).toBeDefined();
  });

  it('should not throw when calling showDamage without viewContainer', () => {
    expect(() => service.showDamage(10, 100, 100)).not.toThrow();
  });
});