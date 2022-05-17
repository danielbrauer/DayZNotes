import React, { useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import * as FirestoreService from '../../../services/firestore';
import './AddTimer.css';


function AddTimer(props) {

    const { pageId, userId } = props;

    const [error, setError] = useState('');

    function addTimer(e) {
        e.preventDefault();
        setError(null);

        const timerDesc = document.addTimerForm.timerDesc.value;
        if (!timerDesc) {
            setError('grocery-item-desc-req');
            return;
        }

        FirestoreService.addTimer(timerDesc, pageId, userId)
            .then(() => document.addTimerForm.reset())
            .catch(reason => {
                if (reason.message === 'duplicate-item-error') {
                    setError(reason.message);
                } else {
                    setError('add-list-item-error');
                }
            });
    }

    return (
        <form name="addTimerForm">
            <h3>Items buried</h3>
            <input type="text" name="timerDesc" />
            <button type="submit" onClick={addTimer}>Add</button>
            <ErrorMessage errorCode={error}></ErrorMessage>
        </form>
    );
}

export default AddTimer;