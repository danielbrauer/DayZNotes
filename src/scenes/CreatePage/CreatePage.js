import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import * as FirestoreService from '../../services/firestore';
import './CreatePage.css';

function CreatePage(props) {

    const { onCreate, userId } = props;

    const [ error, setError ] = useState();

    function createPage(e) {
        e.preventDefault();
        setError(null);

        const userName = document.createPageForm.userName.value;
        if (!userName) {
            setError('user-name-required');
            return;
        }

        FirestoreService.createPage(userName, userId)
            .then(docRef => {
                onCreate(docRef.id, userName);
            })
            .catch(reason => setError('create-list-error'));
    }

    return (
        <div>
            <header>
                <h1>DayZ Notes</h1>
            </header>
            <div className="create-container">
                <div>
                    <form name="createPageForm">
                        <p><label>What is your name?</label></p>
                        <p><input type="text" name="userName" /></p>
                        <ErrorMessage errorCode={error}></ErrorMessage>
                        <p><button onClick={createPage}>Create a new Notes Page</button></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePage;