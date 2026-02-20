"use client";

import { Email } from "./EmailList";

interface Props {
  email: Email;
  onBack: () => void;
}

export default function EmailViewer({ email, onBack }: Props) {

  const date = new Date(email.createdAt).toLocaleString();

  return (
    <div className="flex flex-col h-full bg-white">

      {/* top */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <h2 className="text-lg font-semibold">
          {email.subject}
        </h2>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto p-8">

        <p className="text-sm text-gray-500 mb-2">
          From: {email.from}
        </p>

        <p className="text-xs text-gray-400 mb-6">
          {date}
        </p>

        <div className="whitespace-pre-wrap text-gray-800">
          {email.body}
        </div>

      </div>
    </div>
  );
}