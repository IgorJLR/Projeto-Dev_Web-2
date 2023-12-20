// Input.jsx
import React, { KeyboardEvent, useRef, useState } from "react";
import { TTodoRestItem } from "./App";

type TProps = {
  todolist: TTodoRestItem[];
  setTodolist: (todolist: TTodoRestItem[]) => void;
};

export default function InputComponent(props: TProps) {
  const { todolist, setTodolist } = props;
  const [todoText, setTodoText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnterKey = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedValue = todoText.trim();
      if (!trimmedValue) {
        // Display an error message or provide feedback to the user.
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/item", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo: trimmedValue, date: selectedDate }),
        });

        const { lastID } = await response.json();

        console.log("New item added:", { id: lastID, text: trimmedValue, date: selectedDate });

        if (inputRef.current) {
          inputRef.current.dataset.id = lastID;
          inputRef.current.className = 'synced';
        }

        const newItem = { id: lastID, text: trimmedValue, ref: inputRef, date: selectedDate };
        setTodolist([...todolist, newItem]);
        setTodoText("");
        setSelectedDate(undefined);
      } catch (error) {
        console.error('Error adding todo:', error);
        // Handle the error, e.g., display an error message to the user.
      }
    }
  };

  return (
    <div className="input-container">
      <input
        ref={inputRef}
        className="input-action"
        type="text"
        placeholder="O que fará a seguir?"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        onKeyDown={handleEnterKey}
      />
      <input
        type="date"
        value={selectedDate || ""}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  );
}
