import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCommisionComponent } from './flight-commision.component';

describe('FlightCommisionComponent', () => {
  let component: FlightCommisionComponent;
  let fixture: ComponentFixture<FlightCommisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlightCommisionComponent]
    });
    fixture = TestBed.createComponent(FlightCommisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
