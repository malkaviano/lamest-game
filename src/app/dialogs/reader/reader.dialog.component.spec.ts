import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { documentOpened } from '../../../../tests/fakes';

import { ReaderDialogComponent } from './reader.dialog.component';

describe('ReaderDialogComponent', () => {
  let component: ReaderDialogComponent;
  let fixture: ComponentFixture<ReaderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReaderDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: documentOpened,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
