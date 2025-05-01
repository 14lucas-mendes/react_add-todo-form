import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

export type User = {
  id: number;
  name: string;
  userName: string;
  email: string;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user: User;
};

export const App = () => {
  const [title, setTitle] = useState('Enter a title');
  const [hasTitleError, setHasTitleError] = useState(true);
  const [userId, setUserId] = useState(0);
  const [hasUserError, setHasUserError] = useState(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    setHasUserError(false);
  };

  function resetFields() {
    setTitle('Enter a title');
    setUserId(0);
  }

  const hasAdd = (event: React.FormEvent) => {
    resetFields();
  };

  const handleUserId = todosFromServer.map(todo => ({
    ...todo,
    user: usersFromServer.find(user => user.id === todo.userId),
  }));

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST">
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTitleChange}
          />
          <span className="error">Please enter a title</span>
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={handleUserIdChange}
          >
            <option value="0" disabled>
              Choose a user
            </option>
          </select>

          <span className="error">Please choose a user</span>
        </div>

        <button type="submit" data-cy="submitButton" onSubmit={hasAdd}>
          Add
        </button>
      </form>
    </div>
  );
};
