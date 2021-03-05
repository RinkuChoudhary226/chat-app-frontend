import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjComponent } from './all-proj.component';

describe('AllProjComponent', () => {
  let component: AllProjComponent;
  let fixture: ComponentFixture<AllProjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllProjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
