"use client";

import { useEffect, useState } from "react";
import EmailCard from "@/components/EmailCard";
import { getEmails } from "../../../../lib/api";

interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
}

export default function Inbox({
  params,
}: {
  params: { address: string };
}) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    const data = await getEmails(params.address);
    setEmails(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-xl font-bold text-red-600">MailMint</h1>
        <span className="text-sm font-mono text-gray-600">
          {params.address}
        </span>
      </header>

      {loading && <p>Loading emails...</p>}

      {emails.length === 0 && !loading && (
        <p className="text-gray-500">No emails yet.</p>
      )}

      <div className="space-y-4">
        {emails.map((email) => (
          <EmailCard key={email._id} email={email} />
        ))}
      </div>
    </div>
  );
}
