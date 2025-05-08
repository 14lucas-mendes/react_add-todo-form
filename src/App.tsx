import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user: User | undefined;
};

export const App = () => {
  const [title, setTitle] = useState('Enter a title');
  //const [titleError, setTitleError] = useState(false);

  const [userId, setUserId] = useState(0);
  //const [userError, setUserError] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    //setTitleError(false);
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    //setUserError(false);
  };

  /*function resetFields() {
    setTitle('Enter a title');
    setUserId(0);
  }*/

  const hasAdd = (event: React.FormEvent) => {
    event.preventDefault();

    //setTitleError(!title);
    //setUserError(!userId);

    if (!title || !userId) {
      return;
    }
  };

  const todosWithUser: Todo[] = todosFromServer.map(todo => ({
    ...todo,
    user: usersFromServer.find((user: User) => user.id === todo.userId),
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
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <span className="error">Please choose a user</span>
        </div>

        <button type="submit" data-cy="submitButton" onSubmit={hasAdd}>
          Add
        </button>
      </form>

      <TodoList todos={todosWithUser} />
    </div>
  );
};
