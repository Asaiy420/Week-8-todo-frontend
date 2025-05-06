import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          My Tasks
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Stay organized and boost your productivity with our beautiful task
          manager
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-gray-400">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-600 hover:border-blue-500"
                  }`}
                >
                  {todo.completed && (
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-gray-100 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-sm text-gray-400">
            <p>
              {todos.filter((t) => t.completed).length} of {todos.length} tasks
              completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
