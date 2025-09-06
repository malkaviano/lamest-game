import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { AnimatedProgressBarWidgetComponent, ProgressBarData } from './animated-progress-bar.widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AnimatedProgressBarWidgetComponent', () => {
  let component: AnimatedProgressBarWidgetComponent;
  let fixture: ComponentFixture<AnimatedProgressBarWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimatedProgressBarWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedProgressBarWidgetComponent);
    component = fixture.componentInstance;

    component.data = {
      current: 80,
      max: 100,
      label: 'HP',
      type: 'hp'
    };

    // Mock ViewChild elements to avoid null reference errors
    component.fillElement = {
      nativeElement: document.createElement('div')
    } as ElementRef<HTMLDivElement>;

    component.shineElement = {
      nativeElement: document.createElement('div')
    } as ElementRef<HTMLDivElement>;

    component.trackElement = {
      nativeElement: document.createElement('div')
    } as ElementRef<HTMLDivElement>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    expect(component.data.label).toBe('HP');
  });

  it('should handle data changes', () => {
    const newData: ProgressBarData = {
      current: 60,
      max: 100,
      label: 'EP',
      type: 'ep'
    };
    
    component.data = newData;
    expect(() => component.ngOnChanges({
      data: {
        currentValue: newData,
        previousValue: { current: 80, max: 100, label: 'HP', type: 'hp' },
        firstChange: false,
        isFirstChange: () => false
      }
    })).not.toThrow();
  });
});