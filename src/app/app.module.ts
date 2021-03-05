import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { SiteHomeComponent } from './site-home/site-home.component';
import { UserProjComponent } from './user-proj/user-proj.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { BuyPlanComponent } from './buy-plan/buy-plan.component';
import { MentorsComponent } from './mentors/mentors.component';
import { StarRatingComponent } from './utilities/star-rating/star-rating.component';
import { UpdateSettingsComponent } from './update-settings/update-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { MembershipComponent } from './membership/membership.component';
import { NotifSettingsComponent } from './notif-settings/notif-settings.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ProfDetailsComponent } from './prof-details/prof-details.component';
import { InterestTopicsComponent } from './interest-topics/interest-topics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { ViewMentorProfileComponent } from './view-mentor-profile/view-mentor-profile.component';
import { CreateProjComponent } from './create-proj/create-proj.component';
import { AllProjComponent } from './all-proj/all-proj.component';
import { MyProjComponent } from './my-proj/my-proj.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SearchComponent } from './search/search.component';
import { SkillTagComponent } from './skill-tag/skill-tag.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CalendarComponent } from './calendar/calendar.component';
import { DatepickerDirective } from './directivepipes/datepicker.directive';
import { DateLocalPipe } from './directivepipes/Date.pipe';
import { MentorcalendarComponent } from './mentorcalendar/mentorcalendar.component';

const config: SocketIoConfig = { url: 'http://206.189.135.43:3001', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    UserHomeComponent,
    SiteHomeComponent,
    UserProjComponent,
    ChatBoxComponent,
    BuyPlanComponent,
    MentorsComponent,
    StarRatingComponent,
    UpdateSettingsComponent,
    ChangePasswordComponent,
    ViewProfileComponent,
    MembershipComponent,
    NotifSettingsComponent,
    PersonalDetailsComponent,
    ProfDetailsComponent,
    InterestTopicsComponent,
    CompleteProfileComponent,
    ViewMentorProfileComponent,
    CreateProjComponent,
    AllProjComponent,
    MyProjComponent,
    PagenotfoundComponent,
    SearchComponent,
    SkillTagComponent,
    CalendarComponent,
    DatepickerDirective,
    DateLocalPipe,
    MentorcalendarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
