import { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a To-Do App', completed: true },
  ]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (idToDelete) => {
    setTodos(todos.filter(todo => todo.id !== idToDelete));
  };

  const toggleComplete = (idToToggle) => {
    setTodos(
      todos.map(todo =>
        todo.id === idToToggle
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  return (
    <div className="app">
      <h1>My To-Do App</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;