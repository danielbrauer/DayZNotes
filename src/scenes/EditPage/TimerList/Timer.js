import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useEffect, useReducer } from "react";
import * as FirestoreService from '../../../services/firestore';

dayjs.extend(duration)

function Timer(props) {
    const { timerDoc, pageId } = props

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const timer = timerDoc.data()

    const expiryDate = dayjs(timer.created.toDate()).add(timer.length, 'days')
    const expiryString = dayjs.duration(expiryDate.diff(dayjs())).format('DD[D] HH:mm:ss')

    useEffect(() => {
        const interval = setInterval(() => forceUpdate(), 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    if (!timer.created) return 'adding'
    return (<div>
        {timer.name} expires {expiryString}
        <button onClick={() => FirestoreService.removeTimer(pageId, timerDoc.id)}>Remove</button>
    </div>);
}

export default Timer;