"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import CreateMailbox from "@/components/CreateMailbox";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import EmailList from "@/components/EmailList";
import ComposeModal from "@/components/ComposeModal";
import { getEmails } from "../../lib/api";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [mailbox, setMailbox] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);

  // Check saved mailbox
  useEffect(() => {
    const saved = localStorage.getItem("mailbox");
    if (saved) setMailbox(saved);
  }, []);

  // Fetch emails when mailbox exists
  useEffect(() => {
    if (!mailbox) return;

    const fetchEmails = async () => {
      const data = await getEmails(mailbox);
      setEmails(data);
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, [mailbox]);

  if (!loadingDone) {
    return <Loader onFinish={() => setLoadingDone(true)} />;
  }

  if (!mailbox) {
    return (
      <CreateMailbox
        onCreated={(email) => {
          localStorage.setItem("mailbox", email);
          setMailbox(email);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f8fc]">
      <Sidebar onCompose={() => setComposeOpen(true)} />

      <div className="flex-1 flex flex-col">
        <Topbar email={mailbox} />
        <EmailList emails={emails} />
      </div>

      {composeOpen && (
       <ComposeModal
  from={mailbox}
  onClose={() => setComposeOpen(false)}
  onSent={async () => {
    const data = await getEmails(mailbox);
    setEmails(data);
  }}
/>
      )}
    </div>
  );
}
