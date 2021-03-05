import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UserProjComponent } from './user-proj/user-proj.component';
import { MentorsComponent } from './mentors/mentors.component';
import { UpdateSettingsComponent } from './update-settings/update-settings.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotifSettingsComponent } from './notif-settings/notif-settings.component';
import { MembershipComponent } from './membership/membership.component';
import { SiteHomeComponent } from './site-home/site-home.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ProfDetailsComponent } from './prof-details/prof-details.component';
import { InterestTopicsComponent } from './interest-topics/interest-topics.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { ViewMentorProfileComponent } from './view-mentor-profile/view-mentor-profile.component';
import { MyProjComponent } from './my-proj/my-proj.component';
import { AllProjComponent } from './all-proj/all-proj.component';
import { CreateProjComponent } from './create-proj/create-proj.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MentorcalendarComponent } from './mentorcalendar/mentorcalendar.component';

const routes: Routes = [
  // {path: '', redirectTo: 'site-home', pathMatch: 'full'},
  { path: '', component: SiteHomeComponent },
  { path: 'user-home', component: UserHomeComponent },
  {
    path: 'complete-profile', component: CompleteProfileComponent,
    children: [
      { path: 'personal-dtl', component: PersonalDetailsComponent },
      { path: 'prof-dtl', component: ProfDetailsComponent },
      { path: 'interest-topics', component: InterestTopicsComponent },
    ]
  },
  { path: 'mentors', component: MentorsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'mentor-profile', component: ViewMentorProfileComponent },
  { path: 'mentor-calendar/:mentorid', component: MentorcalendarComponent },
  { path: 'chat-box', component: ChatBoxComponent },
  {
    path: 'settings', component: UpdateSettingsComponent,
    children: [
      { path: 'profile', component: ViewProfileComponent },
      { path: 'personal-dtl', component: PersonalDetailsComponent },
      { path: 'prof-dtl', component: ProfDetailsComponent },
      { path: 'interest-topics', component: InterestTopicsComponent },
      { path: 'pwdchange', component: ChangePasswordComponent },
      // {path: 'notif-set', component: NotifSettingsComponent},
      // {path: 'membership', component: MembershipComponent}
    ]
  },
  {
    path: 'user-proj', component: UserProjComponent,
    children: [
      { path: 'my-proj', component: MyProjComponent },
      { path: 'all-proj', component: AllProjComponent },
      { path: 'create-proj', component: CreateProjComponent }
    ]
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
