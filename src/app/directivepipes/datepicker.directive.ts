import { Directive, HostListener } from '@angular/core';

declare const moment: any;
declare const $: any;
@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective {

  constructor() { }
  ngOnInit(): void {
  }
  @HostListener('click', ['$event'])
  onFocusEnter(event: any) {
    if ($('.datetimepicker').length > 0) {
      $('.datetimepicker').datetimepicker('remove');
    }
    let options: any = {
      icons: {
        time: 'far fa-clock', date: 'far fa-calendar-alt', up: 'fas fa-arrow-up', down: 'fas fa-arrow-down', previous: 'fas fa-chevron-left', next: 'fas fa-chevron-right', today: 'fas fa-calendar-check', clear: 'far fa-trash-alt', close: 'far fa-times-circle'
      },
      format: 'yyyy-mm-dd hh:ii',
      todayBtn: true,
      todayHighlight: true,
      autoclose: true
    }
    if (event.target.dataset.mindate) {
      options.startDate = moment(event.target.dataset.mindate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
    }
    $('[data-cntid=' + event.target.id + ']').datetimepicker(options).on('changeDate', function (e) {
      if ($('#' + event.target.id).datetimepicker()) {
        try {
          $('#' + event.target.id).datetimepicker('remove');
        } catch (e) {

        }
        let elem = document.getElementById(event.target.id);
        elem.dispatchEvent(new CustomEvent("sectionChange", {
          detail: { selectedDate: moment(e.date).format('YYYY-MM-DD HH:mm') }
        }));
      }
    }).datetimepicker('show');
  }
}
