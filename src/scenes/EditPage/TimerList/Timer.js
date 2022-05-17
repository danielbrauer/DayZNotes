import dayjs from 'dayjs';
import 'dayjs/locale/de';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import React from "react";

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
    const { timer, i } = props

    if (!timer.created) return 'adding'

    const expiryString = dayjs(timer.created.toDate()).add(timer.length, 'days').calendar()
    return <div key={i}>{timer.name} expires {expiryString}</div>;
}

export default Timer;