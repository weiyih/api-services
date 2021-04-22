import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat',
  pure: false
})
@Injectable()
export class MomentPipe implements PipeTransform {
  transform(value: string | moment.Moment, dateFormat: string): any {
        return moment(value).format(dateFormat);
    }
}
