import React, { useEffect, useState } from 'react';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import useQueryString from './hooks/useQueryString';
import CreatePage from './scenes/CreatePage/CreatePage';
import EditPage from './scenes/EditPage/EditPage';
import JoinPage from './scenes/JoinPage/JoinPage';
import * as FirestoreService from './services/firestore';

function App() {

  const [user, setUser] = useState();
  const [page, setPage] = useState();
  const [userId, setUserId] = useState();
  const [error, setError] = useState();

  // Use a custom hook to subscribe to the page ID provided as a URL query parameter
  const [pageId, setPageId] = useQueryString('pageId');

  // Use an effect to authenticate and load the grocery list from the database
  useEffect(() => {
    FirestoreService.authenticateAnonymously()
    .then(userCredential => {
      setUserId(userCredential.user.uid);
      if (pageId) {
        FirestoreService.getPage(pageId)
          .then(page => {
            if (page.exists) {
              setError(null);
              setPage(page.data());
            } else {
              setError('grocery-list-not-found');
              setPageId();
            }
          })
          .catch(() => setError('grocery-list-get-fail'));
      }
    })
    .catch(() => setError('anonymous-auth-failed'));
  }, [pageId, setPageId]);

  function onPageCreate(pageId, userName) {
    setPageId(pageId);
    setUser(userName);
  }

  function onClosePage() {
    setPageId();
    setPage();
    setUser();
  }

  function onSelectUser(userName) {
    setUser(userName);
    FirestoreService.getPage(pageId)
      .then(updatedPage => setPage(updatedPage.data()))
      .catch(() => setError('grocery-list-get-fail'));
  }

  // render a scene based on the current state
  if (page && user) {
    return <EditPage {...{ pageId, user, onClosePage, userId }}></EditPage>;
  } else if(page) {
    return (
      <div>
        <ErrorMessage errorCode={error}></ErrorMessage>
        <JoinPage users={page.users} {...{ pageId, onSelectUser, onClosePage, userId }}></JoinPage>
      </div>
    );
  }
  return (
    <div>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <CreatePage onCreate={onPageCreate} userId={userId}></CreatePage>
    </div>
  );
}

export default App;
