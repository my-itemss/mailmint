"use client";

import { useState } from "react";
import { sendEmail } from "../../lib/api";

interface Props {
  from: string;
  onClose: () => void;
  onSent?: () => void;
}

export default function ComposeModal({
  from,
  onClose,
  onSent,
}: Props) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!to.trim()) {
      setError("Recipient email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendEmail({
        to,
        from,
        subject,
        body,
      });

      onClose();
      if (onSent) onSent();
    } catch (err: any) {
      setError("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-6 w-[500px] bg-white shadow-2xl rounded-t-xl border animate-slideUp">
      
      {/* Header */}
      <div className="flex justify-between p-3 bg-gray-100 rounded-t-xl">
        <h2 className="font-semibold">New Message</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        
        <input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border-b py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-b py-2 outline-none"
        />

        <textarea
          placeholder="Message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full outline-none resize-none"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3">
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
