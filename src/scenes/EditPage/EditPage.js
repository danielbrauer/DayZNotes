import React from 'react';
import AddTimer from './AddTimer/AddTimer';
import './EditPage.css';
import TimerList from './TimerList/TimerList';

function EditPage(props) {

    const { pageId, user, onClosePage, userId } = props;

    function onCreatePageClick(e) {
        e.preventDefault();
        onClosePage();
    }

    return (
        <div>
            <header className="app-header">
                <h1>DayZ Notes Page</h1>
                <p><strong>Hi {user}!</strong></p>
                <p>Add timers when you bury things.</p>
            </header>
            <div className="edit-container">
                <div className="list-column">
                    <TimerList {...{pageId}}></TimerList>
                    <AddTimer {...{pageId, userId}}></AddTimer>
                </div>
            </div>
            <footer className="app-footer">
                <p>Share this page with others using <a href={`/?pageId=${pageId}`} target="_blank" rel="noopener noreferrer">this link</a> or <a href="/" onClick={onCreatePageClick}>create a new page</a>.</p>
            </footer>
        </div>
    );
}

export default EditPage;