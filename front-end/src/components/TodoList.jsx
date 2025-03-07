import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TodoList = () => {
  const { user } = useContext(AuthContext); // Ambil user yang sedang login
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Buat key unique untuk menyimpan todo berdasarkan user login
  const storageKey = `todos_${user.id}`;

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem(storageKey)) || [];
    setTodos(savedTodos);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  const addTodo = () => {
    if (input.trim() !== "") {
      const newTodos = [...todos, input.trim()];
      setTodos(newTodos);
      setInput("");
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="px-6 flex flex-col gap-7">
      <div className="flex justify-between">
        <div className="flex flex-col g-5">
          <h1 className="font-bold text-3xl text-black">Todo List</h1>
          <p className="font-sm text-sm text-slate-500">Write your work here</p>
        </div>
        <div>
          <button 
            onClick={addTodo} 
            className="bg-orange-300 rounded-lg py-0.2 px-4 text-white hover:bg-orange-400 cursor-pointer"
          >
            <i className="bi bi-plus text-4xl"></i>
          </button>
        </div>
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Add a new task..."
        className="py-2 px-4 rounded-md focus:outline-none border border-slate-500/[0.5]"
      />
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-orange-300">
            <tr>
              <th className="font-medium text-lg text-orange-500 py-2 text-left">Content</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index} className="border-b border-orange-500/[0.5]">
                <td className="font-light text-base text-orange-500 py-4">{todo}</td>
                <td>
                  <i 
                    className="bi bi-trash3 text-xl font-bold text-red-500 cursor-pointer" 
                    onClick={() => deleteTodo(index)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
