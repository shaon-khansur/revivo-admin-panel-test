import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealcomissionComponent } from './dealcomission.component';

describe('DealcomissionComponent', () => {
  let component: DealcomissionComponent;
  let fixture: ComponentFixture<DealcomissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DealcomissionComponent]
    });
    fixture = TestBed.createComponent(DealcomissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
