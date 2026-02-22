"use client";

import { useState } from "react";
import { loginMailbox } from "../../lib/api";

interface Props {
  onLogin: (email: string, displayName: string) => void;
}

// Reusable Floating Label Input Component
interface FloatingInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function FloatingInput({ type, value, onChange, label }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative mb-4">
      {/* Floating Label */}
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${
            isActive
              ? "top-1 text-xs text-[#1877f2]"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500"
          }
        `}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full border rounded-lg px-4 pt-5 pb-2 outline-none transition-all duration-200
          ${
            isActive
              ? "border-[#1877f2] ring-1 ring-[#1877f2]"
              : "border-gray-300"
          }
        `}
      />
    </div>
  );
}

export default function LoginMailbox({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginMailbox(email, password);
      onLogin(data.email, data.displayName);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FloatingInput
        type="email"
        value={email}
        onChange={setEmail}
        label="Email Address"
      />

      <FloatingInput
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
      />

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full h-11 rounded-lg font-medium transition
      ${
        loading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }
      text-white`}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </div>
  );
}
