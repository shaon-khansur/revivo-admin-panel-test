import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportDialogComponent } from './airport-dialog.component';

describe('AirportDialogComponent', () => {
  let component: AirportDialogComponent;
  let fixture: ComponentFixture<AirportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AirportDialogComponent]
    });
    fixture = TestBed.createComponent(AirportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
