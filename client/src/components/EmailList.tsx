"use client";

import { useState } from "react";
import EmailRow from "./EmailRow";
import EmailViewer from "./EmailViewer";

export interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  createdAt: string;
  starred: boolean;
  read: boolean;
}

interface Props {
  emails: Email[];
   mailbox: string;
    onDeleted: (id: string) => void;
}

export default function EmailList({ emails , mailbox , onDeleted }: Props) {
  const [selected, setSelected] = useState<Email | null>(null);

  return (
    <div className="flex-1 overflow-hidden">

      <div className="h-full bg-white rounded-l-2xl overflow-hidden flex flex-col">

        {selected ? (
          <EmailViewer
            email={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <>
            {/* Toolbar */}
            <div className="px-6 py-3 robo border-b border-gray-200 bg-white text-lg text-gray-500">
              Inbox
            </div>

            {/* Empty */}
            {emails.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4 opacity-20">📁</div>
              <h2 className="text-xl font-medium">Inbox folder is empty</h2>
              <p className="text-sm">There are no messages in this category yet.</p>
            </div>
            )}

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {/* {emails.map((email) => (
                <EmailRow
                  key={email._id}
                  userEmail={mailbox} 
                  email={email}
                  onClick={() => setSelected(email)}
                />
              ))} */}

              {/* {emails.map((email) => (
  <EmailRow
    key={email._id}
    email={email}
    onClick={() => setSelected(email)}
    userEmail={mailbox}
    onDeleted={(id) =>
      setEmails((prev) => prev.filter((m) => m._id !== id))
    }
  />
))} */}

{emails.map((email) => (
  <EmailRow
    key={email._id}
    email={email}
    userEmail={mailbox}
    onDeleted={onDeleted}
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