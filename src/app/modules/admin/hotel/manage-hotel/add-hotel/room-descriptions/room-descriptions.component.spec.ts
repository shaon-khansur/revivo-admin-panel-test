import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDescriptionsComponent } from './room-descriptions.component';

describe('RoomDescriptionsComponent', () => {
  let component: RoomDescriptionsComponent;
  let fixture: ComponentFixture<RoomDescriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RoomDescriptionsComponent]
    });
    fixture = TestBed.createComponent(RoomDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
