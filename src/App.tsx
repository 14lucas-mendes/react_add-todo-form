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
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const [userId, setUserId] = useState(0);
  const [userError, setUserError] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (titleError && event.target.value.trim()) {
      setTitleError('');
    }
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedtUserId = +event.target.value;

    setUserId(selectedtUserId);

    if (userError && selectedtUserId !== 0) {
      setUserError('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let isValid = true;

    // Validação do input
    if (!title.trim()) {
      setTitleError('Please enter a title');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isValid = false;
    } else {
      setTitleError('');
    }

    // Validação do usuário
    if (userId === 0) {
      setUserError('Please choose a user');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isValid = false;
    } else {
      setUserError('');
    }

    if (isValid) {
      // Resetar os campos após o envio (opcional)
      setTitle('');
      setUserId(0);
    }
  };

  const todosWithUser: Todo[] = todosFromServer.map(todo => ({
    ...todo,
    user: usersFromServer.find((user: User) => user.id === todo.userId),
  }));

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter a Title"
            value={title}
            onChange={handleTitleChange}
          />
          {titleError && <span className="error">Please enter a title</span>}
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

          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todosWithUser} />
    </div>
  );
};
