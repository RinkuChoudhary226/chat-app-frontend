import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { EventsService } from '../services/events.service';
import { SlotService } from '../services/slot.service';

declare const $: any;
declare const FullCalendar: any;
declare const moment: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  selectoption = '';
  eventemail = [];
  eventenddate: any;
  eventstartdate: any;
  eventname = '';
  calendar: any;
  slots: any;
  events: any = [];
  eventdetail: any = {};
  slotdetail: any = {};
  slotenddate: any;
  slotstartdate: any;
  userid = AppComponent.appUser.userId;
  isMentor: boolean = (AppComponent.appUser.accountType == 'Mentor');
  startDate: any;
  endDate: any;
  iseditevent = false;
  iseditslot = false;
  curraction = 'E';
  minenddate = moment().format('YYYY-MM-DD HH:mm');
  constructor(
    private eventService: EventsService,
    private slotService: SlotService,
  ) { }
  ngOnInit() {
    setTimeout(() => {
      $('.fc-today-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        if (this.curraction == 'E') {
          this.getAllEvents();
        } else {
          this.getAllSlots();
        }
      });
      $('button.fc-prev-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        if (this.curraction == 'E') {
          this.getAllEvents();
        } else {
          this.getAllSlots();
        }
      });
      $('button.fc-next-button').click(() => {
        this.startDate = moment(this.calendar.getDate()).startOf('month').format('YYYY-MM-DD');
        this.endDate = moment(this.calendar.getDate()).endOf('month').format('YYYY-MM-DD');
        this.calendar.removeAllEvents();
        if (this.curraction == 'E') {
          this.getAllEvents();
        } else {
          this.getAllSlots();
        }
      });
    }, 500);
    var calendarEl = document.getElementById('calendar');
    this.calendar = new FullCalendar.Calendar(calendarEl, {
      customButtons: {
        Eventbutton: {
          text: 'Events',
          click: () => {
            this.curraction = 'E';
            this.getAllEvents();
          }
        },
        Roomsbutton: {
          text: 'Rooms',
          click: () => {
            this.curraction = 'R';
            this.getAllSlots();
          }
        }
      },
      headerToolbar: {
        left: 'prev,next Eventbutton,Roomsbutton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      dayMaxEvents: true,
      initialDate: new Date(),
      selectable: true,
      select: (start, end, allDay) => {
        let startdate = moment(start.start);
        let currentdate = moment();
        if (this.isMentor && (startdate.diff(currentdate, 'days') >= 0)) {
          if (this.curraction == 'E') {
            this.eventdetail.startDate = moment(start.start).format('YYYY-MM-DD HH:mm');
            this.eventdetail.endDate = moment(start.start).format('YYYY-MM-DD HH:mm');
            $('#eventdetails').modal('show');
            this.iseditevent = true;
          } else {
            this.slotdetail.start = moment(start.start).format('YYYY-MM-DD HH:mm');
            this.slotdetail.end = moment(start.start).format('YYYY-MM-DD HH:mm');
            $('#slotdetails').modal('show');
            this.iseditslot = true;
          }
        }
      },
      eventMouseEnter: (arg: any) => {
        let details = this.events.filter(val => val._id == arg.event.id)[0];
        if (details.type == 'event') {
          let attdet = '';
          details.attendees.forEach((element, index) => {
            if (index < 5) {
              var letters = '0123456789ABCDEF';
              var color = '#';
              for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
              }
              attdet += '<span class="profileImage" style="background-color:' + color + ' !important">' + ((element.username) ? element.username.substring(0, 2) : '').toUpperCase() + '</span>';
            }
          });
          attdet += (details.attendees.length > 5) ? ' and ' + (details.attendees.length - 5) + ' more' : '';
          let content = `<table><tbody><tr><td>Agenda</td><td>${details.agenda}</td></tr>
          <tr><td>Event Url</td><td>${details.eventUrl}</td></tr><tr><td>Start</td><td>${details.startDate}</td></tr>
          <tr><td>End</td><td>${details.endDate}</td></tr></tbody><tfoot><tr><td colspan=2><br>${attdet}</td></tr></tfoot></table>`;
          $(arg.jsEvent.target).closest('.fc-daygrid-event-harness').popover({
            title: details.eventName, content: content, trigger: "hover",
            html: true, sanitize: false, container: 'body'
          }).on("mouseenter", function () {
            $(this).popover("show");
          }).on("mouseleave", function () {
            $(this).popover("hide");
          }).popover('show')
        }
      },
      eventClick: (arg: any) => {
        this.eventdetail = this.events.filter(val => val._id == arg.event.id)[0];
        let startdate = moment(arg.event.start);
        let currentdate = moment();
        if (this.eventdetail.type == 'slot') {
          this.slotdetail = this.eventdetail;
          this.slotdetail.cansubscribe = (!this.isMentor && (this.slotdetail.menteeId == this.userid) && (startdate.diff(currentdate, 'days') > 0)) ? false : true;
          this.slotdetail.canchange = (!this.isMentor && (!this.slotdetail.menteeId) && (startdate.diff(currentdate, 'days') > 0)) ? true : false;
          this.slotdetail.start = moment.utc(this.eventdetail.start).format('YYYY-MM-DD HH:mm')
          this.slotdetail.end = moment.utc(this.eventdetail.end).format('YYYY-MM-DD HH:mm')
          $('#slotdetails').modal('show');
        } else {
          this.eventdetail.canmodify = ((this.eventdetail.mentorId == this.userid) && (startdate.diff(currentdate, 'days') > 0)) ? true : false;
          this.eventdetail.subscribe = ((this.eventdetail.mentorId != this.userid) && (this.eventdetail.attendees.filter(val => val.userId == this.userid)).length == 0 && (startdate.diff(currentdate, 'days') > 0)) ? true : false;
          this.eventdetail.canchange = ((this.eventdetail.mentorId != this.userid) && (this.eventdetail.attendees.filter(val => val.userId == this.userid)).length > 0 && (startdate.diff(currentdate, 'days') > 0)) ? true : false;
          this.eventdetail.startDate = moment.utc(this.eventdetail.startDate).format('YYYY-MM-DD HH:mm')
          this.eventdetail.endDate = moment.utc(this.eventdetail.endDate).format('YYYY-MM-DD HH:mm')
          $('#eventdetails').modal('show');
        }
      },
      nowIndicator: true,
      events: this.events,
      height: '600px'
    });
    this.calendar.render();
    this.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
    this.endDate = moment(new Date()).endOf('month').format('YYYY-MM-DD');
    this.getAllEvents();
    this.curraction = 'E';
  }
  unbookSlot() {
    this.slotService.unRegisterSlot(this.slotdetail._id).subscribe(data => {
      this.getAllSlots();
      $('#slotdetails').modal('hide');
    });
  }
  getAllEvents() {
    $('.fc-Roomsbutton-button').removeClass('btnactive');
    $('.fc-Eventbutton-button').addClass('btnactive');
    this.events = [];
    this.eventService.getAllEvents(this.startDate, this.endDate).subscribe(data => {
      this.calendar.removeAllEvents();
      data.forEach((element: any) => {

        element.type = 'event';
        this.events.push(element);
        this.calendar.addEvent({
          id: element._id,
          title: element.agenda,
          start: moment(element.startDate).format('YYYY-MM-DD HH:mm'),
          end: moment(element.endDate).format('YYYY-MM-DD HH:mm'),
          color: (element.mentorId == this.userid) ? 'Red' : ((element.attendees.filter(val => val.userId == this.userid)).length > 0) ? 'green' : ''
        });
        this.calendar.unselect();
      });
    });
  }
  getAllSlots() {
    $('.fc-Eventbutton-button').removeClass('btnactive');
    $('.fc-Roomsbutton-button').addClass('btnactive');
    this.events = [];
    if (this.isMentor) {
      this.slotService.getAllSlotsByMentor(this.startDate, this.endDate, this.userid).subscribe(data => {
        this.calendar.removeAllEvents();
        data.forEach((element: any) => {
          element.type = 'slot';
          this.events.push(element);
          this.calendar.addEvent({
            id: element._id,
            title: element.roomname,
            start: moment(element.start).format('YYYY-MM-DD HH:mm'),
            end: moment(element.end).format('YYYY-MM-DD HH:mm')
          });
          this.calendar.unselect();
        });
      });
    } else {
      this.slotService.getAllSlotsByMentee(this.startDate, this.endDate, this.userid).subscribe(data => {
        this.calendar.removeAllEvents();
        data.forEach((element: any) => {
          element.type = 'slot';
          this.events.push(element);
          this.calendar.addEvent({
            id: element._id,
            title: element.roomname,
            start: moment(element.start).format('YYYY-MM-DD HH:mm'),
            end: moment(element.end).format('YYYY-MM-DD HH:mm')
          });
          this.calendar.unselect();
        });
      });
    }
  }
  deleteEvent() {
    this.eventService.deleteEvent(this.eventdetail._id).subscribe(data => {
      $('#eventdetails').modal('hide');
      let event = this.calendar.getEventById(this.eventdetail._id);
      event.remove();
      this.eventdetail = {};
    });
  }
  editEvent() {
    this.iseditevent = true;
    setTimeout(() => {
      $('#editeventstartdate').datetimepicker({
        icons: {
          time: 'far fa-clock', date: 'far fa-calendar-alt', up: 'fas fa-arrow-up', down: 'fas fa-arrow-down', previous: 'fas fa-chevron-left', next: 'fas fa-chevron-right', today: 'fas fa-calendar-check', clear: 'far fa-trash-alt', close: 'far fa-times-circle'
        },

        format: 'YYYY-MM-DD hh:mm',
        defaultDate: (this.eventdetail.startDate) ? moment(this.eventdetail.startDate).format('YYYY-MM-DD HH:mm') : new Date()
      }).on('dp.change', (e: any) => {
        this.eventdetail.startDate = (e.date.format('YYYY-MM-DD HH:mm'));
      });
      $('#editeventenddate').datetimepicker({
        icons: {
          time: 'far fa-clock', date: 'far fa-calendar-alt', up: 'fas fa-arrow-up', down: 'fas fa-arrow-down', previous: 'fas fa-chevron-left', next: 'fas fa-chevron-right', today: 'fas fa-calendar-check', clear: 'far fa-trash-alt', close: 'far fa-times-circle'
        },
        format: 'YYYY-MM-DD hh:mm',

        defaultDate: (this.eventdetail.endDate) ? moment(this.eventdetail.endDate).format('YYYY-MM-DD HH:mm') : new Date()
      }).on('dp.change', (e: any) => {
        this.eventdetail.endDate = (e.date.format('YYYY-MM-DD HH:mm'));
      });
    }, 100);
  }
  createEvents() {
    const payload = {
      eventName: this.eventdetail.eventName,
      mentorId: this.userid,
      startDate: this.eventdetail.startDate,
      endDate: this.eventdetail.endDate,
      agenda: this.eventdetail.agenda,
      maxattendees: this.eventdetail.maxattendees,
      eventUrl: this.eventdetail.eventUrl,
      isDeleted: false,
      isActive: true,
      type: 'event'
    }
    this.eventService.createEvent(payload).subscribe(data => {
      this.events.push(data.event);
      this.calendar.addEvent({
        id: data.event._id,
        title: this.eventdetail.eventName,
        start: this.eventdetail.startDate,
        end: this.eventdetail.endDate,
      })
      this.eventdetail = {};
      this.calendar.unselect();
      $('#eventdetails').modal('hide');
    });

  }
  editCreateEvent() {
    const payload = {
      isDeleted: false,
      isActive: true,
      attendees: [],
      eventName: this.eventdetail.eventName,
      mentorId: this.userid,
      startDate: moment(this.eventdetail.startDate).format('YYYY-MM-DD HH:mm'),
      endDate: moment(this.eventdetail.endDate).format('YYYY-MM-DD HH:mm'),
      agenda: this.eventdetail.agenda,
      maxattendees: this.eventdetail.maxattendees,
      eventUrl: this.eventdetail.eventUrl,
      createdAt: moment(new Date).format('YYYY-MM-DD HH:mm'),
      updatedAt: moment(new Date).format('YYYY-MM-DD HH:mm')
    }
    const eventid = this.eventdetail._id
    this.eventService.editEvent(payload, eventid).subscribe(data => {
      $('#eventdetails').modal('hide');
      $('#eventdetails').modal('hide');
      this.eventdetail = {};
      this.iseditevent = false;
    });
  }
  createSlot() {
    const payload = {
      roomname: this.slotdetail.roomname,
      start: this.slotdetail.start,
      end: this.slotdetail.end,
      roomdate: moment(this.slotdetail.start).format('YYYY-MM-DD'),
      mentor_rating: 0,
      room_url: this.slotdetail.room_url,
      mentorId: this.userid,
      "mentor": {
        "username": AppComponent.appUser.userName,
        "rating": "0"
      },
      type: 'slot'
    }
    this.slotService.createSlot(payload).subscribe(data => {
      this.getAllSlots();
      this.iseditslot = false;
      this.slotdetail = {};
      $('#slotdetails').modal('hide');
    });
  }
  editCreateSlot() {
    const payload = {
      roomname: this.slotdetail.roomname,
      start: this.slotdetail.start,
      end: this.slotdetail.end,
      roomdate: this.slotdetail.roomdate,
      mentor_rating: 0,
      room_url: this.slotdetail.room_url,
      mentorId: this.userid,
      type: 'slot'
    }
    this.slotService.updateSlot(payload, this.slotdetail._id).subscribe(data => {
      $('#slotdetails').modal('hide');
      this.iseditslot = false;
      this.slotdetail = {};
    });
  }
  closeEditSlot() {
    $('#slotdetails').modal('hide');
    this.iseditslot = false;
    this.slotdetail = {};
  }
  closeEditEvent() {
    $('#eventdetails').modal('hide');
    this.eventdetail = {};
    this.iseditevent = false;
  }
  deleteSlot() {
    this.slotService.deleteSlot(this.slotdetail._id).subscribe(data => {
      $('#slotdetails').modal('hide');
      let event = this.calendar.getEventById(this.slotdetail._id);
      event.remove();
    });
  }
  subscribeEvent() {
    this.eventService.registerEvent(this.eventdetail._id, this.userid).subscribe(data => {
      this.getAllEvents();
      $('#eventdetails').modal('hide');
    });
  }
  unregisterEvent() {
    this.eventService.unregisterEvent(this.eventdetail._id, this.userid).subscribe(data => {
      this.getAllEvents();
      $('#eventdetails').modal('hide');
    });
  }

}
