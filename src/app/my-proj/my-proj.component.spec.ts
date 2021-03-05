import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjComponent } from './my-proj.component';

describe('MyProjComponent', () => {
  let component: MyProjComponent;
  let fixture: ComponentFixture<MyProjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
