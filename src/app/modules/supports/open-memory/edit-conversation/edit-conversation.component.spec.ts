import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConversationComponent } from './edit-conversation.component';

describe('EditConversationComponent', () => {
  let component: EditConversationComponent;
  let fixture: ComponentFixture<EditConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditConversationComponent]
    });
    fixture = TestBed.createComponent(EditConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
