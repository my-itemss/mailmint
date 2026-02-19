"use client";

import { useState } from "react";
import { createMailbox } from "../../lib/api";

interface Props {
  onCreated: (email: string, displayName: string) => void; 
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
      const data = await createMailbox(customEmail.trim(), password, displayName.trim());
      onCreated(data.email, data.displayName); // Pass both to parent
    } catch (err: any) {
      setError(err.message || "Failed to create mailbox");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Create Mailbox</h2>

      <input
        type="text"
        placeholder="Your Name (e.g. John Doe)"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Custom email (optional)"
          value={customEmail}
          onChange={(e) => setCustomEmail(e.target.value)}
          className="flex-1 border p-2 rounded-l"
        />
        <span className="bg-gray-100 border border-l-0 p-2 rounded-r text-gray-600 text-sm flex items-center">
          @{process.env.NEXT_PUBLIC_MAIL_DOMAIN || "mailmint.test"}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Leave empty for random email
      </p>

      <input
        type="password"
        placeholder="Set password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        {loading ? "Creating..." : "Create Email"}
      </button>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}