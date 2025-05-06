import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface TodoItem {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const API_URL = "http://localhost:5000/api";

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Fetch todos after setting user
          fetchTodos(userData._id);
        } else {
          setError("Please log in to manage your todos");
        }
      } catch (error) {
        console.log("Error when checking auth", error);
      }
    };

    checkAuth();
  }, []);

  const fetchTodos = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/todos/todos`, {
        params: { userId },
      });
      setTodos(response.data.todos);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || "Failed to fetch todos");
      console.error("Error fetching todos:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      setError("Please log in to add todos");
      return;
    }
    if (!newTodo.title.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const todoData = {
        title: newTodo.title.trim(),
        description: newTodo.description.trim() || "",
        completed: false,
      };

      console.log("Sending todo data:", todoData);

      const response = await axios.post<TodoItem>(
        `${API_URL}/todos/add-todo/${user._id}`,
        todoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.data) {
        setTodos([...todos, response.data]);
        setNewTodo({ title: "", description: "" });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (
        error.response?.status === 500 &&
        error.response?.data?.error?.includes("ObjectId")
      ) {
        setError("Authentication error. Please log in again.");
      } else {
        setError(
          error.response?.data?.error || "Failed to add todo. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    if (!user?._id) {
      setError("Please log in to update todos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const todo = todos.find((t) => t._id === todoId);
      if (!todo) return;

      const response = await axios.put(`${API_URL}/todos/edit-todo/${todoId}`, {
        title: todo.title,
        description: todo.description,
        completed: !completed,
      });

      setTodos(todos.map((t) => (t._id === todoId ? response.data : t)));
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || "Failed to update todo");
      console.error("Error updating todo:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!user?._id) {
      setError("Please log in to delete todos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/todos/delete-todo/${todoId}`);
      setTodos(todos.filter((todo) => todo._id !== todoId));
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.error || "Failed to delete todo");
      console.error("Error deleting todo:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Please Log In</h2>
        <p className="text-gray-400">
          You need to be logged in to manage your todos.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          My Tasks
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Welcome back, {user.username}! Manage your tasks here.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
        <form onSubmit={addTodo} className="mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              placeholder="Task title..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              placeholder="Task description (optional)..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {loading && todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-gray-400">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="group flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200"
              >
                <button
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  disabled={loading}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-600 hover:border-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                <div className="flex-1">
                  <h3
                    className={`text-gray-100 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-sm text-gray-400 ${
                        todo.completed ? "line-through" : ""
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  disabled={loading}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
