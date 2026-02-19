"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import CreateMailbox from "@/components/CreateMailbox";
import LoginMailbox from "@/components/LoginMailbox";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import EmailList from "@/components/EmailList";
import ComposeModal from "@/components/ComposeModal";
import { getEmails } from "../../lib/api";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [mailbox, setMailbox] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [emails, setEmails] = useState<any[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"create" | "login">("login");

  // Check saved mailbox and display name
  useEffect(() => {
    const saved = localStorage.getItem("mailbox");
    const savedName = localStorage.getItem("displayName");
    if (saved) setMailbox(saved);
    if (savedName) setDisplayName(savedName);
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

  const handleAuthSuccess = (email: string, userDisplayName?: string) => {
    localStorage.setItem("mailbox", email);
    if (userDisplayName) {
      localStorage.setItem("displayName", userDisplayName);
      setDisplayName(userDisplayName);
    }
    setMailbox(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("mailbox");
    localStorage.removeItem("displayName");
    setMailbox(null);
    setDisplayName("");
    setAuthMode("login");
  };

  if (!loadingDone) {
    return <Loader onFinish={() => setLoadingDone(true)} />;
  }

  // Show auth screen if no mailbox
  if (!mailbox) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-96">
          {/* Toggle Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 pb-2 text-center font-medium transition ${
                authMode === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("create")}
              className={`flex-1 pb-2 text-center font-medium transition ${
                authMode === "create"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create New
            </button>
          </div>

          {/* Show Create or Login based on mode */}
          {authMode === "create" ? (
            <CreateMailbox onCreated={handleAuthSuccess} />
          ) : (
            <LoginMailbox onLogin={handleAuthSuccess} />
          )}
        </div>
      </div>
    );
  }

  // Main app view
  return (
    <div className="flex h-screen bg-[#f6f8fc]">
      <Sidebar onCompose={() => setComposeOpen(true)} />

      <div className="flex-1 flex flex-col">
        <Topbar 
          email={mailbox} 
          displayName={displayName}
          onLogout={handleLogout} 
        />
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