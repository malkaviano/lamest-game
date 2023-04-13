import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetPanelComponent } from './sheet.panel.component';

describe('SheetPanelComponent', () => {
  let component: SheetPanelComponent;
  let fixture: ComponentFixture<SheetPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
