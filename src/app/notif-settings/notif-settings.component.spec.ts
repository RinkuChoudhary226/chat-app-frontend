import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifSettingsComponent } from './notif-settings.component';

describe('NotifSettingsComponent', () => {
  let component: NotifSettingsComponent;
  let fixture: ComponentFixture<NotifSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
