import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import * as FirestoreService from '../../services/firestore';
import './JoinPage.css';

function JoinPage(props) {

    const { users, pageId, onSelectUser, onClosePage, userId } = props;

    const [ error, setError ] = useState();

    function addExistingUser(e) {
        e.preventDefault();
        onSelectUser(e.target.innerText);
    }

    function getUserButtonList() {
        const buttonList = users.map(user => <button key={user.name} onClick={addExistingUser}>{user.name}</button>);
        return <div className="button-group">{buttonList}</div>;
    }

    function addNewUser(e) {
        e.preventDefault();
        setError(null);

        const userName = document.addUserToPageForm.name.value;
        if (!userName) {
            setError('user-name-required');
            return;
        }

        if (users.find(user => user.name === userName)) {
            onSelectUser(userName);
        } else {
            FirestoreService.addUserToPage(userName, pageId, userId)
                .then(() => onSelectUser(userName))
        }
    }

    function onCreatePageClick(e) {
        e.preventDefault();
        onClosePage();
    }

    return (
        <div>
            <header>
                <h1>DayZ Notes</h1>
            </header>
            <div className="join-container">
                <div>
                    <form name="addUserToPageForm">
                        <p>Select your name if you previously joined the page...</p>
                        {getUserButtonList()}
                        <p>...or enter your name to join the page...</p>
                        <p>
                            <input type="text" name="name" />
                            <button onClick={addNewUser}>Join</button>
                        </p>
                        <ErrorMessage errorCode={error}></ErrorMessage>
                        <p>...or <a href="/" onClick={onCreatePageClick}>create a new page</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JoinPage;