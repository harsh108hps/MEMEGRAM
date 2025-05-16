import React, { useState } from "react";
import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showRegister, setshowRegister] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-0 p-6 relative z-50">
        {/* Close button */}
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login to MemeGram
        </h2>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none px-3 py-2 rounded text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none px-3 py-2 rounded text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded text-sm font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        {/* Register link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              onSwitchToRegister();
              onClose();
            }}
            className="text-teal-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
