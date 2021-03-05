import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjComponent } from './user-proj.component';

describe('UserProjComponent', () => {
  let component: UserProjComponent;
  let fixture: ComponentFixture<UserProjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
