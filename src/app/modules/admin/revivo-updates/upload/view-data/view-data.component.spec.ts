import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataComponent } from './view-data.component';

describe('ViewDataComponent', () => {
  let component: ViewDataComponent;
  let fixture: ComponentFixture<ViewDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewDataComponent]
    });
    fixture = TestBed.createComponent(ViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
