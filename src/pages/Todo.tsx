import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";

interface TodoItem {
  _id: string;
  todoId: number;
  title: string;
  description: string;
  hasCompleted?: boolean;
  dueDate: string;
  userId: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const API_URL = "http://localhost:3000/api";

export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          fetchTodos();
        } else {
          setError("Please log in to manage your todos");
        }
      } catch (error) {
        console.log("Error when checking auth", error);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.get(`${API_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data.data.todo || []);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch todos"
      );
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
    if (
      !newTodo.title.trim() ||
      !newTodo.description.trim() ||
      !newTodo.dueDate
    ) {
      setError("Please provide all the required fields.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const todoData = {
        title: newTodo.title.trim(),
        description: newTodo.description.trim(),
        dueDate: newTodo.dueDate,
        userId: user._id,
      };
      const response = await axios.post(`${API_URL}/todo`, todoData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // The backend returns a single todo object
      if (response.data && response.data.data && response.data.data.todo) {
        setTodos([...todos, response.data.data.todo]);
        setNewTodo({ title: "", description: "", dueDate: "" });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add todo. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditFields({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate.slice(0, 10), // for input type="date"
    });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditFields({ title: "", description: "", dueDate: "" });
  };

  const saveEditTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    if (
      !editFields.title.trim() ||
      !editFields.description.trim() ||
      !editFields.dueDate
    ) {
      setError("Please provide all the required fields.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axios.put(
        `${API_URL}/todo/${editingTodo._id}`,
        {
          title: editFields.title.trim(),
          description: editFields.description.trim(),
          dueDate: editFields.dueDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the todo in the list
      if (response.data && response.data.data && response.data.data.todo) {
        setTodos(
          todos.map((t) =>
            t._id === editingTodo._id ? response.data.data.todo : t
          )
        );
        setEditingTodo(null);
        setEditFields({ title: "", description: "", dueDate: "" });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update todo"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId: string, hasCompleted: boolean) => {
    if (!user?._id) {
      setError("Please log in to update todos");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      // If you want to support hasCompleted, add it to your backend and model
      const response = await axios.put(
        `${API_URL}/todo/${todoId}`,
        { hasCompleted: !hasCompleted },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.data && response.data.data.todo) {
        setTodos(
          todos.map((t) => (t._id === todoId ? response.data.data.todo : t))
        );
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update todo"
      );
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
      const token = getToken();
      await axios.delete(`${API_URL}/todo/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(todos.filter((todo) => todo._id !== todoId));
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete todo"
      );
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
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-800 to-yellow-500 bg-clip-text text-transparent animate-gradient">
          My Tasks
        </h1>
        <p className="text-xl text-blue-500 max-w-2xl mx-auto">
          Welcome back, {user.username}! Manage your tasks here.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
        {editingTodo ? (
          <form onSubmit={saveEditTodo} className="mb-8 space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={editFields.title}
                onChange={(e) =>
                  setEditFields({ ...editFields, title: e.target.value })
                }
                placeholder="Task title..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={editFields.description}
                onChange={(e) =>
                  setEditFields({ ...editFields, description: e.target.value })
                }
                placeholder="Task description..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={editFields.dueDate}
                onChange={(e) =>
                  setEditFields({ ...editFields, dueDate: e.target.value })
                }
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold ml-2 hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
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
                placeholder="Task description..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, dueDate: e.target.value })
                }
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
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
        )}

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
                  onClick={() =>
                    toggleTodo(todo._id, todo.hasCompleted || false)
                  }
                  disabled={loading}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.hasCompleted
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-600 hover:border-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {todo.hasCompleted && (
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
                      todo.hasCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-sm text-gray-400 ${
                        todo.hasCompleted ? "line-through" : ""
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {todo.dueDate.slice(0, 10)}
                  </p>
                </div>
                <button
                  onClick={() => startEditTodo(todo)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  disabled={loading}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-sm text-gray-400">
            <p>
              {todos.filter((t) => t.hasCompleted).length} of {todos.length}{" "}
              tasks completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
