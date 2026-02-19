"use client";

import { useState } from "react";
import EmailRow from "./EmailRow";
import EmailViewer from "./EmailViewer";

interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  date?: string;
}

interface Props {
  emails: Email[];
}

export default function EmailList({ emails }: Props) {
  const [selected, setSelected] = useState<Email | null>(null);

  return (
    <div className="flex-1 overflow-hidden">

      {/* Outer container (gmail style rounded only left) */}
      <div className="h-full bg-white rounded-l-2xl overflow-hidden flex flex-col">

        {/* If email opened */}
        {selected ? (
          <EmailViewer
            email={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <>
            {/* Toolbar */}
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
              Inbox
            </div>

            {/* Empty state */}
            {emails.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                No emails yet.
              </div>
            )}

            {/* Email rows */}
            <div className="overflow-y-auto flex-1">
              {emails.map((email) => (
                <EmailRow
                  key={email._id}
                  email={email}
                  onClick={() => setSelected(email)}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
