import React, { KeyboardEvent, MouseEvent } from "react";
import { TTodoRestItem } from "./App";

type TProps = {
  todolist: TTodoRestItem[];
  setTodolist: (todolist: TTodoRestItem[]) => void;
};

export default function YourComponent(props: TProps) {
  const { todolist, setTodolist } = props;

  const removeItem = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' });
      const newTodolist = todolist.filter((val) => val.id !== id);
      setTodolist(newTodolist);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const editItem = async (id: number, updates: Partial<TTodoRestItem>) => {
    try {
      await fetch(`http://localhost:3000/item/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      setTodolist((prevTodolist: TTodoRestItem[]) =>
        prevTodolist.map((item: TTodoRestItem) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  const keyDown = async (event: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value.trim(); // Trim para remover espaços em branco
      if (value !== '') {
        editItem(id, { text: value });
      }
    }
  };
  
  const editDate = async (id: number, date: string | undefined) => {
    const currentDate = date ?? '';
    const newDate = prompt('Enter new date:', currentDate);
  
    if (newDate !== null && newDate.trim() !== '') { // Verifica se o novo valor não é vazio
      try {
        const response = await fetch(`http://localhost:3000/item/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: newDate }),
        });
  
        const data = await response.json();
        console.log('Response from server:', data);
  
        const updatedList = todolist.map((item) =>
          item.id === id ? { ...item, date: newDate } : item
        );
  
        console.log('Updated list:', updatedList);
  
        setTodolist(updatedList);
      } catch (error) {
        console.error('Error editing date:', error);
      }
    }
  };
  

  return (
    <>
      <ul>
        {todolist.map((todo) => {
          console.log('Item from database:', todo);
  
          return (
            <li
              key={todo.id}
              data-id={todo.id}
              className={todo.id < 0 ? 'pending' : 'synced'}
            >
              <button onClick={() => removeItem(todo.id)}>remove</button>
              {todo.date && (
                <>
                  <span>{new Date(todo.date).toLocaleDateString()}</span>
                  <button onClick={() => editDate(todo.id, todo.date)}>
                    edit date
                  </button>
                </>
              )}
              <input
                data-id={todo.id}
                defaultValue={todo.text}
                onKeyDown={(e) => keyDown(e, todo.id)}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
  
}
