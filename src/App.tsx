import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Todo } from "./pages/Todo";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="relative">
        <nav className="mb-6 flex gap-4">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/todo"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Todo
          </Link>
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Login
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
