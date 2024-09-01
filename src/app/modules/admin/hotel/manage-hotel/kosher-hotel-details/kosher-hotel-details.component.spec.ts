import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KosherHotelDetailsComponent } from './kosher-hotel-details.component';

describe('KosherHotelDetailsComponent', () => {
  let component: KosherHotelDetailsComponent;
  let fixture: ComponentFixture<KosherHotelDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KosherHotelDetailsComponent]
    });
    fixture = TestBed.createComponent(KosherHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
