import React, { useEffect, useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import * as FirestoreService from '../../../services/firestore';
import Timer from './Timer';

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

    const timerElements = timers.map((timer, i) => <Timer {...{ timer, i }} />)

    return (
        <div>
            <ErrorMessage errorCode={error}></ErrorMessage>
            <div>{timerElements}</div>
        </div>
    );
}

export default TimerList;