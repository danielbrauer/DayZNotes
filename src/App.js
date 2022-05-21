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
    async function setup() {
      try {
        const userCredential = await FirestoreService.authenticateAnonymously()
        setUserId(userCredential.user.uid);
        if (pageId) {
          try {
            const page = await FirestoreService.getPage(pageId)
            if (page.exists) {
              setError(null);
              setPage(page.data());
            } else {
              setError('grocery-list-not-found');
              setPageId();
            }
          }
          catch (error) {
            setError('grocery-list-get-fail');
          }
        }
      }
      catch (error) {
        setError('anonymous-auth-failed')
      }
    }
    setup()
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

  async function onSelectUser(userName) {
    setUser(userName);
    try {
      const updatedPage = await FirestoreService.getPage(pageId)
      setPage(updatedPage.data())
    }
    catch (error) {
      setError('grocery-list-get-fail')
    }
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
