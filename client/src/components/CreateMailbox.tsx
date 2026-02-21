"use client";

import { useState } from "react";
import { createMailbox } from "../../lib/api";

interface Props {
  onCreated: (email: string, displayName: string) => void;
}

interface FloatingInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  rounded?: string;
}

function FloatingInput({
  type,
  value,
  onChange,
  label,
  className = "",
  rounded = "rounded-lg",
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <label
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${
            isActive
              ? "top-1 text-xs text-blue-600"
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
          w-full border px-3 pt-5 pb-2 outline-none transition-all duration-200
          ${rounded}
          ${
            isActive
              ? "border-blue-500 ring-2 ring-blue-500"
              : "border-gray-300"
          }
        `}
      />
    </div>
  );
}

export default function CreateMailbox({ onCreated }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!displayName.trim()) {
      setError("Name is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await createMailbox(
        customEmail.trim(),
        password,
        displayName.trim(),
      );
      onCreated(data.email, data.displayName);
    } catch (err: any) {
      setError(err.message || "Failed to create mailbox");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-6 text-gray-800">
        Create your mailbox
      </h2>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <FloatingInput
        type="text"
        value={displayName}
        onChange={setDisplayName}
        label="Full name"
        className="mb-4"
      />

      <div className="flex mb-4">
        <FloatingInput
          type="text"
          value={customEmail}
          onChange={setCustomEmail}
          label="Custom email"
          rounded="rounded-l-lg"
          className="flex-1"
        />

        <span className="border border-l-0 border-gray-300 px-3 flex items-center rounded-r-lg text-gray-600 text-sm">
          @{process.env.NEXT_PUBLIC_MAIL_DOMAIN || "mailmint.com"}
        </span>
      </div>

      <FloatingInput
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        className="mb-6"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`w-full h-11 rounded-lg font-medium transition 
      ${
        loading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }
      text-white`}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </div>
  );
}
