import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      if (response.data && response.data.data) {
        // Store token and user in localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        // Redirect to todo page
        navigate("/todo");
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:shadow-blue-500/10">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Welcome Back
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 text-gray-400">
            <input
              type="checkbox"
              className="rounded border-gray-700 bg-gray-900/50 text-blue-500 focus:ring-blue-500/20"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transform transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
