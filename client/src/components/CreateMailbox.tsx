"use client";

import { useState } from "react";
import { createMailbox } from "../../lib/api";

interface Props {
  onCreated: (email: string) => void;
}

export default function CreateMailbox({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      const data = await createMailbox(name);
      onCreated(data.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Create Mailbox
        </h1>

        <input
          type="text"
          placeholder="Custom name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Email"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
