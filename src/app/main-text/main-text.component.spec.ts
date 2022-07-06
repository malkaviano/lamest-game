import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MainTextComponent } from './main-text.component';

describe('MainTextComponent', () => {
  let component: MainTextComponent;
  let fixture: ComponentFixture<MainTextComponent>;
  let text = 'p1\np2\np3\np4';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainTextComponent);
    component = fixture.componentInstance;

    fixture.componentInstance.text = text;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 paragraphs', () => {
    const result = fixture.debugElement
      .queryAll(By.css('.main-text p'))
      .map((e) => e.nativeElement);

    expect(result.length).toEqual(4);
  });
});
