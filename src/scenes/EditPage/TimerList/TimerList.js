import dayjs from 'dayjs';
import 'dayjs/locale/de';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
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

function TimerList(props) {

    const { pageId } = props;

    const [ timers, setTimers ] = useState([]);
    const [ error, setError ] = useState();

    // Use an effect hook to subscribe to the timer stream and
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
        const unsubscribe = FirestoreService.streamPageTimers(pageId,
            (querySnapshot) => {
                const updatedTimers =
                querySnapshot.docs.map(docSnapshot => docSnapshot.data());
                setTimers(updatedTimers);
            },
            (error) => setError('grocery-list-item-get-fail')
        );
        return unsubscribe;
    }, [pageId, setTimers]);

    console.log(dayjs.locale())
    const timerElements = timers.map((timer, i) => {
        if (!timer.created) return 'adding'
        return <div key={i}>{timer.name} expires {dayjs(timer.created.toDate()).add(12, 'days').calendar()}</div>;

    })

    return (
        <div>
            <ErrorMessage errorCode={error}></ErrorMessage>
            <div>{timerElements}</div>
        </div>
    );
}

export default TimerList;