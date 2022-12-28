import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);

        component = fixture.componentInstance;
      });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should', () => {
    const result = component.goToLink('www.google.com');

    expect(result).not.toBeNull();
  });
});
