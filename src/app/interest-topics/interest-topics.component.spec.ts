import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestTopicsComponent } from './interest-topics.component';

describe('InterestTopicsComponent', () => {
  let component: InterestTopicsComponent;
  let fixture: ComponentFixture<InterestTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestTopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
