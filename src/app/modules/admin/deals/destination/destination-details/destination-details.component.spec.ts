import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationDetailsComponent } from './destination-details.component';

describe('DestinationDetailsComponent', () => {
  let component: DestinationDetailsComponent;
  let fixture: ComponentFixture<DestinationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationDetailsComponent]
    });
    fixture = TestBed.createComponent(DestinationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
