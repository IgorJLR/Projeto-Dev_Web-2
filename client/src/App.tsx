// App.jsx
import { useEffect, useState, RefObject } from "react";
import Header from "./Header";
import Input from "./Input";
import List from "./List";
import './App.css';

// In your App.tsx or wherever you define TTodoRestItem
export type TTodoRestItem = {
  id: number;
  text: string;
  ref: React.RefObject<HTMLInputElement>;
  date?: string;
};


const App = () => {
  const [todolist, setTodolist] = useState<TTodoRestItem[]>(
    JSON.parse(localStorage.getItem('todolist') ?? '[]')
  );

  useEffect(() => {
    fetch("http://localhost:3000/item")
      .then(response => response.json())
      .then(data => setTodolist(data));
  }, []);

  return (
    <>
      <Header />
      <div className="content">
        <Input setTodolist={setTodolist} todolist={todolist} />
        <List setTodolist={setTodolist} todolist={todolist} />
      </div>
    </>
  );
};

export default App;

