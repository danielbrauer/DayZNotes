import dayjs from 'dayjs';
import 'dayjs/locale/de';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import React from "react";
import * as FirestoreService from '../../../services/firestore';

dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.locale('de')
dayjs.updateLocale('de', {
    calendar: {
      lastDay: '[yesterday at] H:mm',
      sameDay: '[today at] H:mm',
      nextDay: '[tomorrow at] H:mm',
      lastWeek: '[last] dddd [at] H:mm',
      nextWeek: 'dddd [at] H:mm',
      sameElse: 'D.M.YY [at] H:mm'
    }
  })

function Timer(props) {
    const { timerDoc, pageId } = props
    const timer = timerDoc.data()
    if (!timer.created) return 'adding'

    const expiryString = dayjs(timer.created.toDate()).add(timer.length, 'days').calendar()
    return (<div>
        {timer.name} expires {expiryString}
        <button onClick={() => FirestoreService.removeTimer(pageId, timerDoc.id)}>Remove</button>
    </div>);
}

export default Timer;