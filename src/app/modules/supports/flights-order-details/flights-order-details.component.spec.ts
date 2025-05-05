import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsOrderDetailsComponent } from './flights-order-details.component';

describe('FlightsOrderDetailsComponent', () => {
  let component: FlightsOrderDetailsComponent;
  let fixture: ComponentFixture<FlightsOrderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlightsOrderDetailsComponent]
    });
    fixture = TestBed.createComponent(FlightsOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
