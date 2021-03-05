import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { SlotService } from '../services/slot.service';
declare const $: any;
declare const FullCalendar: any;
declare const moment: any;
@Component({
  selector: 'app-mentorcalendar',
  templateUrl: './mentorcalendar.component.html',
  styleUrls: ['./mentorcalendar.component.scss']
})
export class MentorcalendarComponent implements OnInit {

  constructor(
    private slotService: SlotService,
    private route: ActivatedRoute
  ) {
  }
  mentorid:any;
  selectoption = '';
  eventemail = [];
  eventenddate: any;
  eventstartdate: any;
  eventname = '';
  calendar: any;
  slots: any;
  events: any = [];
  slotdetail: any = {};
  slotenddate: any;
  slotstartdate: any;
  startDate: any;
  endDate: any;
  userid = AppComponent.appUser.userId;
  isMentor: boolean = (AppComponent.appUser.accountType == 'Mentor');
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mentorid = params.mentorid
    });
    this.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
    this.endDate = moment(new Date()).endOf('month').format('YYYY-MM-DD');
    setTimeout(() => {
      $('.fc-today-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        this.getAllSlots();
      });
      $('button.fc-prev-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        this.getAllSlots();
      });

      $('button.fc-next-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        this.getAllSlots();
      });
    }, 500);
    var calendarEl = document.getElementById('calendar');
    this.calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      selectable: true,
      eventClick: (arg: any) => {
        this.slotdetail = this.events.filter(val => val._id == arg.event.id)[0];
        this.slotdetail.cansubscribe = (!this.isMentor && (this.slotdetail.menteeId == this.userid) && (moment(arg.event.start) > moment())) ? false : true;
        this.slotdetail.canchange = (!this.isMentor && (moment(arg.event.start) > moment())) ? true : false;
        $('#slotdetails').modal('show');
      },
      nowIndicator: true,
      dayMaxEvents: true,
      events: this.events,
    });
    this.calendar.render();
    this.getAllSlots();
  }
  getAllSlots() {
    this.events = [];
    this.slotService.getAllSlotsByMentor(this.startDate, this.endDate, this.mentorid).subscribe(data => {
      data.forEach((element: any) => {
        element.type = 'slot';
        this.events.push(element);
        this.calendar.addEvent({
          id: element._id,
          title: element.roomname,
          start: moment(element.start).format('YYYY-MM-DD HH:mm'),
          end: moment(element.end).format('YYYY-MM-DD HH:mm')
          // details: element
        });
        this.calendar.unselect();
      });
    });
  }
  bookSlot() {
    const payload = {
      menteeId: this.userid,
      mentee: {
        username: AppComponent.appUser.userName,
        rating: 0,
        agenda: this.slotdetail.roomname
      }
    }
    this.slotService.registerSlot(payload, this.slotdetail._id).subscribe(data => {
      this.events = this.events.filter(val => val._id != this.slotdetail._id)
      this.events.push(data.room);
      $('#slotdetails').modal('hide');
    });
  }
  unbookSlot() {
    this.slotService.unRegisterSlot(this.slotdetail._id).subscribe(data => {
      this.events = this.events.filter(val => val._id != this.slotdetail._id)
      this.events.push(data.room);
      $('#slotdetails').modal('hide');
    });
  }
  closeEditSlot() {
    $('#slotdetails').modal('hide');
    this.slotdetail = {};
  }
}
