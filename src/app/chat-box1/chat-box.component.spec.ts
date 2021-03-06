import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBox1Component } from './chat-box1.component';

describe('ChatBox1Component', () => {
  let component: ChatBox1Component;
  let fixture: ComponentFixture<ChatBox1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBox1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBox1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
