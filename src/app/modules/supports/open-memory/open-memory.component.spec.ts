import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenMemoryComponent } from './open-memory.component';

describe('OpenMemoryComponent', () => {
  let component: OpenMemoryComponent;
  let fixture: ComponentFixture<OpenMemoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenMemoryComponent]
    });
    fixture = TestBed.createComponent(OpenMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
