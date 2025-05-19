import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          Welcome to Daily Tasks
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your ultimate productivity companion. Organize tasks, boost
          efficiency, and achieve more every day.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10">
          <div className="text-blue-400 text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            Smart Organization
          </h3>
          <p className="text-gray-400">
            Effortlessly organize your tasks with our intuitive interface
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/10">
          <div className="text-purple-400 text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            Lightning Fast
          </h3>
          <p className="text-gray-400">
            Quick and responsive interface for maximum productivity
          </p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/10">
          <div className="text-pink-400 text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            Track Progress
          </h3>
          <p className="text-gray-400">
            Monitor your achievements and stay on top of your goals
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold text-gray-100">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300">
              Join thousands of users who have transformed their productivity
              with TaskFlow
            </p>
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-gray-700/50 text-gray-100 rounded-lg font-semibold hover:bg-gray-700 transform transition-all duration-200 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl">✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
