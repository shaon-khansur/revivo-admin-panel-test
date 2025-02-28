import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TboRoomComponent } from './tbo-room.component';

describe('TboRoomComponent', () => {
  let component: TboRoomComponent;
  let fixture: ComponentFixture<TboRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TboRoomComponent]
    });
    fixture = TestBed.createComponent(TboRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
