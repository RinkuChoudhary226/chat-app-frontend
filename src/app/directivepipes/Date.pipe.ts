import { Pipe, PipeTransform } from '@angular/core';
declare const moment: any;

@Pipe({ name: 'datelocal' })

export class DateLocalPipe implements PipeTransform {
    constructor() { }
    transform(date: any) {
        try {
            return moment.utc(date).local().format('YYYY-MM-DD HH:mm');
        } catch (e) {
            console.log('date error->' + e);
        }
    }
}