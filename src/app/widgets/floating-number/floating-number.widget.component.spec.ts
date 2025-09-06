import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { FloatingNumberWidgetComponent } from './floating-number.widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FloatingNumberWidgetComponent', () => {
  let component: FloatingNumberWidgetComponent;
  let fixture: ComponentFixture<FloatingNumberWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloatingNumberWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingNumberWidgetComponent);
    component = fixture.componentInstance;

    component.data = {
      value: 10,
      type: 'damage'
    };

    // Mock ViewChild elements to avoid null reference errors
    component.floatingElement = {
      nativeElement: document.createElement('div')
    } as ElementRef<HTMLDivElement>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format damage value correctly', () => {
    component.data = { value: 15, type: 'damage' };
    expect(component.formatValue()).toBe('-15');
  });

  it('should format heal value correctly', () => {
    component.data = { value: 20, type: 'heal' };
    expect(component.formatValue()).toBe('+20');
  });

  it('should format experience value correctly', () => {
    component.data = { value: 100, type: 'experience' };
    expect(component.formatValue()).toBe('+100 XP');
  });
});